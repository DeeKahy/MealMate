import fs from 'fs';

function getWeeklyWaste(filePath, date) {
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
                    oneWeekAgo.setFullYear(date.year); // Set the year
                    oneWeekAgo.setMonth(date.month); // Set the month (0-11, where 0 is January)
                    oneWeekAgo.setDate(date.day - 7); // Setting the date and subtracting 7 days to get the last 7 days. The date is being set to a fixed value to make sure the data is still valid if testing of the same data is wanted to be done in the future.
    
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