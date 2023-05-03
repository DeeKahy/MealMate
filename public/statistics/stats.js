function getstuff(api, id) {
  fetch(api)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("response was not in the 200 range " + response.Error)
    })
    .then(data => {
      // Create table element
      const table = document.createElement("table");

      // Create header row
      const headerRow = document.createElement("tr");
      const header1 = document.createElement("th");
      header1.textContent = "Location";
      headerRow.appendChild(header1);

      const header2 = document.createElement("th");
      header2.textContent = "Name";
      headerRow.appendChild(header2);

      const header3 = document.createElement("th");
      header3.textContent = "Date";
      headerRow.appendChild(header3);

      // Add header row to table
      table.appendChild(headerRow);

      // Loop through data and create rows
      data.forEach(item => {
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        cell1.textContent = item.location;
        row.appendChild(cell1);

        const cell2 = document.createElement("td");
        cell2.textContent = item.name;
        row.appendChild(cell2);

        const cell3 = document.createElement("td");
        cell3.textContent = item.wastedDate;
        row.appendChild(cell3);

        // Add row to table
        table.appendChild(row);
      });

      // Add table to HTML page
      const tableContainer = document.getElementById(id);
      tableContainer.appendChild(table);
    })
}

function getCO2(api, id) {
  fetch(api)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("response was not in the 200 range " + response.Error);
    })
    .then(data => {

      const element = document.getElementById(id);
      element.textContent = "CO2 Wasted last 7 days: " + (data.co2).toFixed(2) + " kg";
    })
}

function getWasteRatio(api, id, type) {
  let totalWaste = 0, totalWeight = 0;
  fetch(api)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("response was not in the 200 range " + response.Error);
    })
    .then(data => {
      data.forEach(item => {
        totalWeight += Number(item.weight);
        totalWaste += (item.weight - item.eaten);
      })
      let procent = ((totalWaste / totalWeight) * 100).toFixed(2);
      const element = document.getElementById(id);
      element.textContent = "Wasted " + type + ": " + procent + "%";
    })
}


function getchartstuff(api, id, title) {
  fetch(api)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("response was not in the 200 range " + response.Error);
    })
    .then(data => {
      // Prepare the chart data
      const chartData = {
        labels: [],
        datasets: [
          {
            label: 'Consumed',
            data: [],
            fill: false,
            borderColor: 'green',
            tension: 0.1,
          },
          {
            label: 'Wasted',
            data: [],
            fill: false,
            borderColor: `blue`,
            tension: 0.1,
          }
        ],
      };

      // Loop through data and populate chartData
      data.forEach(item => {
        // Add the date to the labels if it's not already there
        if (!chartData.labels.includes(item.wastedDate)) {
          chartData.labels.push(item.wastedDate);
        }

        const weightWasted = item.weight - item.eaten;

        // Add the weight wasted to the data for the corresponding date index
        const dateIndex = chartData.labels.indexOf(item.wastedDate);
        if (chartData.datasets[1].data[dateIndex] === undefined) {
          if (dateIndex === 0) {
            chartData.datasets[1].data[dateIndex] = weightWasted;
          } else {
            chartData.datasets[1].data[dateIndex] = chartData.datasets[1].data[dateIndex - 1] + weightWasted;
          }
        } else {
          chartData.datasets[1].data[dateIndex] += weightWasted;
        }

        // Add the weight eaten to the data for the corresponding date index
        if (chartData.datasets[0].data[dateIndex] === undefined) {
          if (dateIndex === 0) {
            chartData.datasets[0].data[dateIndex] = item.eaten;
          } else {
            chartData.datasets[0].data[dateIndex] = chartData.datasets[0].data[dateIndex - 1] + item.eaten;
          }
        } else {
          chartData.datasets[0].data[dateIndex] += item.eaten;
        }
      });

      // Sort the labels (dates) in ascending order
      chartData.labels.sort();

      // Create a chart
      const ctx = document.getElementById(id).getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Weight (in grams)'
              }
            },
          },
          title: {
            display: true,
            text: title
          }
        },
      });
    });
}



// get total wasted and put it into the table
document.addEventListener("DOMContentLoaded", (e) => {
  getstuff("/API/getWastedItems", "Total-waste");

  getstuff("/API/getConsumedItems", "Total-consumed");

  getstuff("/API/getweeklyWaste", "Weekly-waste");

  getstuff("/API/getmonthlyWaste", "Monthly-waste");

  getchartstuff("/API/getweeklyWaste", "compareNowChart", "Last 7 days");
  getchartstuff("/API/prevous7days", "compareBeforeChart", "Previous 7 days");
  getWasteRatio("/API/getweeklyWaste", "waste-ratio", "last 7 days");
  getWasteRatio("/API/prevous7days", "waste-ratio-2", "previous 7 days");
  getCO2("/API/getWeeklyCO2", "co2-wasted");
})

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function openTab2(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent2");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink2");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}


// Show the first tab by default
document.getElementById("table1").style.display = "block";
document.getElementsByClassName("tablinks")[0].className += " active";

document.getElementById("weekly").style.display = "block";
document.getElementsByClassName("tablink2")[0].className += " active";

let compareBeforeChartCO2 = document.getElementById("compareBeforeChartCO2")
  let compareNowChartCO2 = document.getElementById("compareNowChartCO2")
  let ToggleButton = document.getElementById("RawData");
  let bool=true
  ToggleButton.addEventListener("click", () => {

    if (bool) {
      compareBeforeChartCO2.style.visibility = "visible";
      compareNowChartCO2.style.visibility = "hidden";
      compareNowChartCO2.style.display="none"
      ToggleButton.textContent = 'View Data in Procent';
      compareBeforeChartCO2.style.display="block"
      bool=false
    } else {
      compareBeforeChartCO2.style.visibility = "hidden"; 
      compareNowChartCO2.style.visibility = "visible";
      ToggleButton.textContent = 'View Data in kilogram';
      compareBeforeChartCO2.style.display="none"
      compareNowChartCO2.style.display="block"
      bool=true
    }

  })


//Forstå det her inden push
async function getGraph(apiCurrent, apiPrevious) {
  
  // Fetch data for current week
  const current = await fetch(apiCurrent);
  const currentWeek = await current.json();

  // Fetch data for previous week
  const previous = await fetch(apiPrevious);
  const previousWeek = await previous.json();

  const currentPercentage = (currentWeek.co2 / (currentWeek.co2 + previousWeek.co2)) * 100;
  const previousPercentage = (previousWeek.co2 / (currentWeek.co2 + previousWeek.co2)) * 100;

  // Create a pie chart
  const pieGraph1 = document.querySelector("#compareNowChartCO2").getContext('2d');
  const pieGraph2 = document.querySelector("#compareBeforeChartCO2").getContext('2d');
    new Chart(pieGraph1, {
      type: 'pie',
      data: {
        labels: ['Current week', 'Previous week'],
        datasets: [{
          label: 'CO2 emissions in %',
          data: [currentPercentage.toFixed(2), previousPercentage.toFixed(2)],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
    rawDataGraph = new Chart(pieGraph2, {
      type: 'pie',
      data: {
        labels: ['Current week', 'Previous week'],
        datasets: [{
          label: 'CO2 emissions in kg',
          data: [currentWeek.co2.toFixed(2), previousWeek.co2.toFixed(2)],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    }); 
    compareBeforeChartCO2.style.visibility = "hidden";  compareBeforeChartCO2.style.display="none"
}



getGraph("/API/getWeeklyCO2", "/API/prevous7daysCO2")
