import path from "path";
import fs from "fs";

const removeItem = {
  wasteItem: (req, res, filePathitems, filePathConsumed) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePathitems, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          reject(err);
        } else {
          let filejson = JSON.parse(data);
          if (filejson.length < req.body.index) {
            res.status(500).send("Internal Server Error");
            reject("index out of bounds");
          }
          else {
            const item = filejson[req.body.index];
            filejson.splice(req.body.index, 1);
            fs.writeFile(filePathitems, JSON.stringify(filejson, null, 2), (err) => {
              if (err) {
                console.error('Error writing file:', err);
                res.status(500).send("Internal Server Error");
                reject(err);
              }
              fs.readFile(filePathConsumed, { encoding: 'utf8' }, (err, data) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Internal Server Error");
                  reject(err);
                } else {
                  let filejson = JSON.parse(data);
                  item.wastedDate = new Date().toISOString().slice(0, 10); // add the new attribute "wastedDate" with the current date in "yyyy-mm-dd" format
                  item.eaten = (item.weight / 100) * req.body.eaten;

                  filejson.push(item);
                  fs.writeFile(filePathConsumed, JSON.stringify(filejson, null, 2), (err) => {
                    if (err) {
                      console.error('Error writing file:', err);
                      res.status(500).send("Internal Server Error");
                      reject(err);
                    }
                    res.status(200).send("success");
                    resolve();
                  })
                }
              })
            })
          }
        }
      })
    });
  }
}

export default removeItem;


