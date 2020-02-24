jQuery.ajax({
  type: 'GET',
  url: 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&resultOffset=0&resultRecordCount=250&cacheHint=true',
  dataType: 'json',
  success: function(response) {
    var nomor = 1;
    var data = response.features;
    var confirmed_total = 0;
    var recovered = 0
    var deaths = 0

    for (var i = 0; i < data.length; i++) {
      var obj = data[i];

      confirmed_total += obj.attributes.Confirmed;

      if (obj.attributes.Deaths == null) {
        data_deaths = 0
        deaths += 0;
      } else {
        data_deaths = obj.attributes.Deaths;
        deaths += obj.attributes.Deaths;
      }

      if (obj.attributes.Recovered == null) {
        data_recovered = 0
        recovered += 0;
      } else {
        data_recovered = obj.attributes.Recovered;
        recovered += obj.attributes.Recovered;
      }

      $('#confirmed_cases').append('<tr>' +
        '<td class="center">' + nomor + '.</td>' +
        '<td>' + obj.attributes.Country_Region + '</td>' +
        '<td class="right">' + obj.attributes.Confirmed + '</td>' +
        '<td class="right">' + data_recovered + '</td>' +
        '<td class="right">' + data_deaths + '</td>' +
        '</tr>');

      nomor += 1
    };

    $("#confirmed").html(confirmed_total);
    $("#recovered").html(recovered);
    $("#deaths").html(deaths);
    $("#confirmed_2").html(confirmed_total);
    $("#recovered_2").html(recovered);
    $("#deaths_2").html(deaths);
  },
  error: function() {}
});


var date = [];
var mainland_china = [];
var other_locations = [];
var total_recovered = [];

jQuery.ajax({
  type: 'GET',
  url: 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/cases_time_v3/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Report_Date_String%20asc&resultOffset=0&resultRecordCount=2000&cacheHint=true',
  dataType: 'json',
  success: function(response) {
    data = response.features;

    for (var i = 0; i < data.length; i++) {
      var obj = data[i];
      var dateTimeString = moment(obj.attributes.Report_Date).format("D MMM YYYY").toString();
      date.push(dateTimeString.split(" "));

      mainland_china.push(obj.attributes.Mainland_China);
      other_locations.push(obj.attributes.Other_Locations);
      total_recovered.push(obj.attributes.Total_Recovered);
    }

    var lineChartData = {
      labels: date,
      datasets: [{
        label: 'China',
        borderColor: 'rgb(255,69,0)',
        backgroundColor: 'rgb(255,69,0)',
        fill: false,
        data: mainland_china,
        yAxisID: 'y-axis-1',
      }, {
        label: 'Negara Lain',
        borderColor: 'rgb(65,105,225)',
        backgroundColor: 'rgb(65,105,225)',
        fill: false,
        data: other_locations
      }, {
        label: 'Sembuh',
        borderColor: 'rgb(34,139,34)',
        backgroundColor: 'rgb(34,139,34)',
        fill: false,
        data: total_recovered
      }]
    };

    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = Chart.Line(ctx, {
      data: lineChartData,
      options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
          display: false,
          text: 'Grafik Jumlah Terinfeksi'
        },
        scales: {
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
            scaleLabel: {
              display: false,
              labelString: 'Jumlah Terinfeksi'
            }
          }],
        }
      }
    });
  },
  error: function() {}
});
