const pool = require("./config/db"); 


const fetchScatterPlotData = async () => {
    try {
        const query = 
            `WITH max_mw AS (
                SELECT MAX(full_mwt) AS max_full_mwt FROM compound_properties
            )
            SELECT width_bucket(full_mwt, 0, (SELECT max_full_mwt FROM max_mw), 65) * 200 AS mw_bucket,
                   AVG(alogp) AS avg_logp
            FROM compound_properties, max_mw
            WHERE full_mwt IS NOT NULL AND alogp IS NOT NULL
            GROUP BY mw_bucket
            ORDER BY mw_bucket;
        ;`

        const result = await pool.query(query);
        return result.rows.map(row => ({ x: row.mw_bucket, y: row.avg_logp }));
    } catch (error) {
        console.error("Error fetching scatter plot data:", error);
        return [];
    }
};


const setupWebSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Client connected");

       
        const sendUpdates = async () => {
            const data = await fetchScatterPlotData();
            const timestamp = new Date().toISOString();
            socket.emit("scatterDataUpdate", {data,timestamp});
        };

        sendUpdates(); 

        const interval = setInterval(sendUpdates, 5000); 

        socket.on("disconnect", () => {
            console.log("Client disconnected");
            clearInterval(interval);
        });
    });
};

module.exports = setupWebSocket;