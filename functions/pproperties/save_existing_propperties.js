import path from 'path';
import fs from 'fs';

function save_single_prop_real(filePath) {
    return async function (req, res) {
        try {
            let name_of_object = req.body.nameofitem;
            let newpropname_of_item = req.body.property;
            let newvalue = req.body.value;
            let formerprop = req.body.formerprop;

            const data = await fs.promises.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            const itemIndex = jsonData.findIndex(item => item.name === name_of_object);
            
            if (itemIndex !== -1) {
                delete jsonData[itemIndex][formerprop];
                jsonData[itemIndex][newpropname_of_item] = newvalue;
                await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));

                res.status(200).json({ message: 'Prop/value added successfully' });
            } else {
               
                res.status(404).send("Item not found");
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    }
}

export default save_single_prop_real;
