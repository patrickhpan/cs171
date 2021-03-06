// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

const sourceDeliveryData = deliveryData;
const sourceFeedbackData = feedbackData;

createVisualization();

function addStat(name, value) {
  $("#stats").append(
    "<tr>" +
    "<td>" + name + "</td>" +
    "<td>" + value + "</td>" +
    "</tr>"
  );
}

function clearStats() {
  $("#stats tr").not(":first").remove();
}

$("#area").change(createVisualization);
$("#type").change(createVisualization);

function filterDelivery(data, options) {
  Object.keys(options).forEach((key) => {
    console.log(key)
    console.log(options[key])
    data = data.filter((entry) => typeof entry[key] !== "undefined" && entry[key].toUpperCase() == options[key].toUpperCase());
  })
  return data;
}

function filterFeedback(deliveries, feedback) {
  var deliveryIDs = deliveries.map((data) => data.delivery_id);
  return feedback.filter((f) => {
    while(deliveryIDs[0] < f.delivery_id) deliveryIDs.shift();
    return deliveryIDs[0] == f.delivery_id;
  })
}

function createVisualization() {

  var area = $("#area").val();
  var type = $("#type").val();
  var filter = {};
  if (area != "all") filter.area = area;
  if (type != "all") filter.order_type = type;

  filteredDeliveryData = filterDelivery(sourceDeliveryData, filter);
  filteredFeedbackData = filterFeedback(filteredDeliveryData, sourceFeedbackData);

  var numDeliveries = filteredDeliveryData.length;
  var totalDelivered = filteredDeliveryData.reduce((total, next) => {
    return {
      count: total.count + next.count
    }
  }).count;
  var avgTime = filteredDeliveryData.reduce((total, next) => {
    return {
      delivery_time: total.delivery_time + next.delivery_time
    }
  }).delivery_time / numDeliveries;
  var totalSales = filteredDeliveryData.reduce((total, next) => {
    return {
      price: total.price + next.price
    }
  }).price;
  var numFeedback = filteredFeedbackData.length;
  var feedbackByType = {
    high: filteredFeedbackData.filter((f) => f.quality === "high").length,
    medium: filteredFeedbackData.filter((f) => f.quality === "medium").length,
    low: filteredFeedbackData.filter((f) => f.quality === "low").length
  }

  clearStats();
  addStat("Number of deliveries", numDeliveries);
  addStat("Number of pizzas delivered", totalDelivered);
  addStat("Average delivery time (minutes)", avgTime.toFixed(0) + "");
  addStat("Total Sales (USD)", "$" + totalSales.toFixed(2));
  addStat("Number of feedback", numFeedback);
  addStat("High rating", feedbackByType.high);
  addStat("Medium rating", feedbackByType.medium);
  addStat("Low rating", feedbackByType.low);

  renderBarChart(filteredDeliveryData)
}
