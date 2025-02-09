const pool = require('../config/db');
const getCompounds = async (req, res) => {
    const {
        q,
        molecule_type,
        full_mwt_min,
        full_mwt_max,
        alogp_min,
        alogp_max,
        hbd_min,
        hbd_max,
        hba_min,
        hba_max,
        psa_min,
        psa_max,
        rtb_min,
        rtb_max,
        max_phase,
        _page = 1,
        _limit = 10,
        _sort = "chembl_id",
        _order = "asc"
    } = req.query;

    const offset = (_page - 1) * _limit;
    let query = `
        SELECT md.chembl_id, md.pref_name, md.molecule_type, md.max_phase, 
               cp.full_mwt, cp.alogp, cp.hbd, cp.hba, cp.psa, cp.rtb
        FROM molecule_dictionary md
        JOIN compound_properties cp ON md.molregno = cp.molregno
        WHERE 1=1
    `;

    let queryParams = [];

    
    if (q) {
        query += ` AND (md.chembl_id ILIKE $${queryParams.length + 1} OR md.pref_name ILIKE $${queryParams.length + 2})`;
        queryParams.push(`%${q}%`, `%${q}%`);
    }

 
    if (molecule_type) {
        query += ` AND md.molecule_type = $${queryParams.length + 1}`;
        queryParams.push(molecule_type);
    }
    if (full_mwt_min && full_mwt_max) {
        query += ` AND cp.full_mwt BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(full_mwt_min, full_mwt_max);
    }
    if (alogp_min && alogp_max) {
        query += ` AND cp.alogp BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(alogp_min, alogp_max);
    }
    if (hbd_min && hbd_max) {
        query += ` AND cp.hbd BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(hbd_min, hbd_max);
    }
    if (hba_min && hba_max) {
        query += ` AND cp.hba BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(hba_min, hba_max);
    }
    if (psa_min && psa_max) {
        query += ` AND cp.psa BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(psa_min, psa_max);
    }
    if (rtb_min && rtb_max) {
        query += ` AND cp.rtb BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(rtb_min, rtb_max);
    }
    if (max_phase) {
        query += ` AND md.max_phase = $${queryParams.length + 1}`;
        queryParams.push(max_phase);
    }


    query += ` ORDER BY ${_sort} ${_order}`;


    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(_limit, offset);

    try {
        const result = await pool.query(query, queryParams);
        const totalQuery = `
            SELECT COUNT(*) FROM molecule_dictionary md
            JOIN compound_properties cp ON md.molregno = cp.molregno
            WHERE 1=1
        `;
        const totalResult = await pool.query(totalQuery);
        res.json({ data: result.rows, totalCount: parseInt(totalResult.rows[0].count) });
    } catch (error) {
        console.error("Error fetching compounds:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};
const getMoleculeTypes = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT molecule_type 
            FROM molecule_dictionary 
            WHERE molecule_type IS NOT NULL
            ORDER BY molecule_type;
        `;

        const result = await pool.query(query);
        const moleculeTypes = result.rows.map(row => row.molecule_type); 
        res.json({ data: moleculeTypes });
    } catch (error) {
        console.error("Error fetching molecule types:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};
const getCompoundDetails = async (req, res) => {
    const { chembl_id } = req.params; 

    try {
        const query = `
            SELECT md.chembl_id, md.pref_name, md.molecule_type, md.max_phase, md.first_approval,
                   cs.canonical_smiles,
                   cp.full_mwt, cp.alogp, cp.hba, cp.hbd, cp.psa, cp.rtb
            FROM molecule_dictionary md
            LEFT JOIN compound_structures cs ON md.molregno = cs.molregno
            LEFT JOIN compound_properties cp ON md.molregno = cp.molregno
            WHERE md.chembl_id = $1;
        `;

        const result = await pool.query(query, [chembl_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Compound not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching compound details:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};




module.exports = { getCompounds,getMoleculeTypes,getCompoundDetails };

