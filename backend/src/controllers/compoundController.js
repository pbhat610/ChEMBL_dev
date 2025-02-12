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
    let query =
        `SELECT md.chembl_id, md.pref_name, md.molecule_type, md.max_phase, 
               cp.full_mwt, cp.alogp, cp.hbd, cp.hba, cp.psa, cp.rtb
        FROM molecule_dictionary md
        JOIN compound_properties cp ON md.molregno = cp.molregno
        WHERE 1=1`
        ;

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
        const totalQuery =
            `SELECT COUNT(*) FROM molecule_dictionary md
            JOIN compound_properties cp ON md.molregno = cp.molregno
            WHERE 1=1;`
            ;
        const totalResult = await pool.query(totalQuery);
        res.json({ data: result.rows, totalCount: parseInt(totalResult.rows[0].count) });
    } catch (error) {
        console.error("Error fetching compounds:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};
const getMoleculeTypes = async (req, res) => {
    try {
        const query =
            `SELECT DISTINCT molecule_type FROM molecule_dictionary WHERE molecule_type IS NOT NULL ORDER BY molecule_type;`;

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
        const query =
            `SELECT md.chembl_id, md.pref_name, md.molecule_type, md.max_phase, md.first_approval, cs.canonical_smiles,cp.full_mwt, cp.alogp, cp.hba, cp.hbd, cp.psa, cp.rtb FROM molecule_dictionary md LEFT JOIN compound_structures cs ON md.molregno = cs.molregno LEFT JOIN compound_properties cp ON md.molregno = cp.molregno WHERE md.chembl_id = $1;`;

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
const getChartData = async (req, res) => {
    try {
        const { molecule_type, hba_min, hba_max, psa_min, psa_max, full_mwt_min, full_mwt_max, alogp_min, alogp_max } = req.query;
        let queryParams = [];
        let filters = [];

        // ✅ Apply filters ONLY to compound_properties
        if (molecule_type) {
            filters.push(molecule_type = `$${queryParams.length + 1}`);
            queryParams.push(molecule_type);
        }
        if (hba_min) {
            filters.push(hba >= `$${queryParams.length + 1}`);
            queryParams.push(hba_min);
        }
        if (hba_max) {
            filters.push(hba <= ` $${queryParams.length + 1}`);
            queryParams.push(hba_max);
        }
        if (psa_min) {
            filters.push(psa >= `$${queryParams.length + 1}`);
            queryParams.push(psa_min);
        }
        if (psa_max) {
            filters.push(psa <= `$${queryParams.length + 1}`);
            queryParams.push(psa_max);
        }
        if (full_mwt_min) {
            filters.push(full_mwt >= `$${queryParams.length + 1}`);
            queryParams.push(full_mwt_min);
        }
        if (full_mwt_max) {
            filters.push(full_mwt <= `$${queryParams.length + 1}`);
            queryParams.push(full_mwt_max);
        }
        if (alogp_min) {
            filters.push(alogp >= `$${queryParams.length + 1}`);
            queryParams.push(alogp_min);
        }
        if (alogp_max) {
            filters.push(alogp <= ` $${queryParams.length + 1}`);
            queryParams.push(alogp_max);
        }

        let whereClause = filters.length ? WHERE`${filters.join(" AND ")}` : "";


        const molecularWeightQuery =
            `SELECT 'molecular_weight' AS type, CAST(width_bucket(full_mwt, 100, 1000, 10) * 100 AS TEXT) AS range_start, COUNT(*) AS count FROM compound_properties ${whereClause} GROUP BY range_start ORDER BY range_start;`;


        const moleculeTypeQuery =
            `SELECT 'molecule_type' AS type, molecule_type AS range_start, COUNT(*) AS count
            FROM molecule_dictionary
            GROUP BY molecule_type;`
            ;


        const logPQuery =
            `SELECT 'logp_distribution' AS type, CAST(width_bucket(alogp, -5, 5, 10) * 1 AS TEXT) AS range_start, COUNT(*) AS count FROM compound_properties ${whereClause} GROUP BY range_start ORDER BY range_start;`;


        const scatterPlotQuery =
            `WITH max_mw AS ( SELECT MAX(full_mwt) AS max_full_mwt FROM compound_properties ) SELECT width_bucket(full_mwt, 0, (SELECT max_full_mwt FROM max_mw), 65) * 200 AS mw_bucket, AVG(alogp) AS avg_logp FROM compound_properties, max_mw ${whereClause} GROUP BY mw_bucket ORDER BY mw_bucket;`;


        const [molecularWeightResult, moleculeTypeResult, logPResult, scatterPlotResult] = await Promise.all([
            queryParams.length ? pool.query(molecularWeightQuery, queryParams) : pool.query(molecularWeightQuery),
            pool.query(moleculeTypeQuery),
            queryParams.length ? pool.query(logPQuery, queryParams) : pool.query(logPQuery),
            queryParams.length ? pool.query(scatterPlotQuery, queryParams) : pool.query(scatterPlotQuery)
        ]);


        const responseData = {
            molecularWeight: molecularWeightResult.rows.map(row => ({ range_start: row.range_start, count: row.count })),
            moleculeType: moleculeTypeResult.rows.map(row => ({ name: row.range_start, value: row.count })), // ✅ No filters applied here
            logP: logPResult.rows.map(row => ({ range_start: row.range_start, count: row.count })),
            scatterPlot: scatterPlotResult.rows.map(row => ({ x: row.mw_bucket, y: row.avg_logp })),
        };

        res.json(responseData);
    } catch (error) {
        console.error("Error fetching chart data:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};






module.exports = { getCompounds, getMoleculeTypes, getCompoundDetails, getChartData };