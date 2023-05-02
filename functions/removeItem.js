import path from "path";
import fs from "fs";
const removeItem = {
  consumeItem: (req, res) => {
    const filePathitems = path.resolve() + `/data/USERS/${req.user.username}/items.json`;
    const filePathConsumed = path.resolve() + `/data/USERS/${req.user.username}/consumeditems.json`;
    let item;
    fs.readFile(filePathitems, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        let filejson = JSON.parse(data);
        item = filejson[req.body.index];
        filejson.splice(req.body.index, 1);
        fs.writeFile(filePathitems, JSON.stringify(filejson, null, 2), (err) => {
          if (err) {
            console.error('Error writing file:', err);
            return;
          }
          fs.readFile(filePathConsumed, { encoding: 'utf8' }, (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).send("Internal Server Error");
            } else {
              let filejson = JSON.parse(data);
              item.wastedDate = new Date().toISOString().slice(0, 10); // add the new attribute "wastedDate" with the current date in "yyyy-mm-dd" format
              filejson.push(item);
              fs.writeFile(filePathConsumed, JSON.stringify(filejson, null, 2), (err) => {
                if (err) {
                  console.error('Error writing file:', err);
                  return;
                }
                res.status(200).send("success");
              })
            }
          })
        })
      }
    })
  },
  wasteItem: (req, res) => {
    const filePathitems = path.resolve() + `/data/USERS/${req.user.username}/items.json`;
    const filePathConsumed = path.resolve() + `/data/USERS/${req.user.username}/wasteditems.json`;
    let item;
    fs.readFile(filePathitems, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error 1");
      } else {
        let filejson = JSON.parse(data);
        item = filejson[req.body.index];
        filejson.splice(req.body.index, 1);
        fs.writeFile(filePathitems, JSON.stringify(filejson, null, 2), (err) => {
          if (err) {
            console.error('Error writing file:', err);
            return;
          }
          fs.readFile(filePathConsumed, { encoding: 'utf8' }, (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).send("Internal Server Error 2");
            } else {
              let filejson = JSON.parse(data);
              item.wastedDate = new Date().toISOString().slice(0, 10); // add the new attribute "wastedDate" with the current date in "yyyy-mm-dd" format
              item.eaten = (item.weight / 100) * req.body.eaten;

              filejson.push(item);
              fs.writeFile(filePathConsumed, JSON.stringify(filejson, null, 2), (err) => {
                if (err) {
                  console.error('Error writing file:', err);
                  return;
                }
                res.status(200).send("success");
              })
            }
          })
        })
      }
    })
  }
}
export default removeItem;  