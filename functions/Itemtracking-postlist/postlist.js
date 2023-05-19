import fs from 'fs';



function postlist(dataPath){
    return async function (req,res) {
        try {
            

            //const dataPath = path.join(path.resolve() + `/data/USERS/${req.user.username}/items.json`);
            let data = [];
            try {
                data = JSON.parse(fs.readFileSync(dataPath));
            } catch (err) {}
           
            // Add the new data to the array
            data.push(req.body);
            
            // Write the updated data back to the JSON file
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            
            res.redirect("/itemtracking");
            
        } catch {err}
    }
}

export default postlist