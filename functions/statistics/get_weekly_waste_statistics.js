import fs from 'fs';

function getWeeklyWaste(filePath) {
    return async function (req, res) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error(err);
                    reject("Internal Server Error");

                    res.status(500).send("Internal Server Error");
                } else {
                    const jsonData = JSON.parse(data.toString("utf8"));
    
                    // Get the date from one week ago
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
                    // Filter the data based on the wastedDate attribute
                    const filteredData = jsonData.filter(item => {
                        const itemDate = new Date(item.wastedDate);
                        return itemDate >= oneWeekAgo;
                    });

                    res.status(200).json(filteredData); 
                    //console.log(filteredData)
                    resolve(filteredData);

                    
                }
            });
        });
    }
}

export default getWeeklyWaste;