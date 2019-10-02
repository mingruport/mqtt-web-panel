const config = {
  type: 'line',
  data: {
    labels: null,
    datasets: [{
      data: null,
      borderColor: 'rgba(54, 162, 235, 1)',
      lineTension: 0,
    }]
  },
  options: {
    responsive: true,
    legend: false
  }
};

const chartCtx = $('#mainChart');
const mainChart = new Chart(chartCtx, config);

function updateChart(chartData) {
  mainChart.data.labels = chartData.date;
  mainChart.data.datasets.forEach(function (dataset) {
    dataset.data = chartData.value;
  });

  mainChart.update();
}

function loadStatisticsData(id, period) {
  $.ajax({
    url: 'api/widgets/' + id + '/events',
    type: 'GET',
    data: { period },
    dataType: 'json',
    success: function (response) {
      $('#mainChart').show();
      updateChart(response);
    },
    error: function (error) {
      $('#mainChart').hide();
      $('#widgetModalAlert').show('fade');
      $('#widgetModalAlert').text(error.responseJSON.message);
    }
  });
}

function loadContent() {
  $.ajax({
    url: 'api/widgets',
    type: 'GET',
    success: function (response) {
      const template = $('#contentTemplate').html();
      const rendered = Mustache.render(template, response);
      $('.content').html(rendered);
    }
  });
}

function saveWidget() {
  const form = $('#addingForm');
  const id = form.find('input[name="id"]').val();
  let requestMetod = '';
  let requestURL = '';

  if (id) {
    requestMetod = 'PUT';
    requestURL = 'api/widgets/' + id;
  } else {
    requestMetod = 'POST';
    requestURL = 'api/widgets';
  }

  $.ajax({
    url: requestURL,
    type: requestMetod,
    contentType: 'application/json',
    data: JSON.stringify({
      name: form.find('input[name="name"]').val(),
      topic: form.find('input[name="topic"]').val(),
      qos: form.find('select[name="qos"]').val(),
      unit: form.find('input[name="unit"]').val()
    }),
    dataType: "json",
    success: function () {
      loadContent();
      $('#addWidgetModal').modal('hide');
    },
    error: function (error) {
      $('#addWidgetModalAlert').show('fade');
      $('#addWidgetModalAlert').text(error.responseJSON.message);
    }
  });
}

function editWidget(id) {
  const form = $('#addingForm');

  $('#widgetModal').modal('hide');
  $('#addWidgetModal').modal('show');
  $('#addWidgetModal').find('.modal-title').text('Edit widget');

  $.ajax({
    url: 'api/widgets/' + id,
    type: 'GET',
    success: function (response) {
      form.find('input[name="id"]').val(response.id),
        form.find('input[name="name"]').val(response.name),
        form.find('select[name="qos"]').val(response.qos),
        form.find('input[name="topic"]').val(response.topic),
        form.find('input[name="unit"]').val(response.unit)
    }
  });
}

function deleteWidget(id) {
  $.ajax({
    url: 'api/widgets/' + id,
    type: 'DELETE',
    success: function () {
      $('#widgetModal').modal('hide');
      loadContent();
    }
  });
}

function updateCardBody(id, message) {
  const template = $('#cardTextTemplate').html();
  const rendered = Mustache.render(template, message);
  $('#' + id + ' .card-text').html(rendered);
}

function updateStatus(statusText, statusColor) {
  $('.navbar-text').text(statusText);
  $('.navbar-text').css('color', statusColor);
}

$(function () {
  loadContent();

  var socket = io.connect();

  socket.on('updateValue', function (data) {
    updateCardBody(data.id, data.message);
  }).on('connect', function () {
    updateStatus('Connected', '#28a745');
  }).on('reconnecting', function () {
    updateStatus('Reconnecting...', '#007bff');
  }).on("disconnect", function () {
    updateStatus('Disconnect', '#dc3545');
  });

  $('#widgetModal').on('shown.bs.modal', function (event) {
    const modal = $(this);
    const card = $(event.relatedTarget);
    const id = card.attr('id');
    const widgetData = card.data('whatever').split('^');

    let period = modal.find('#periodBtn label.active input').val();

    modal.find('.modal-title').html(widgetData[0] + ' <span class="badge badge-secondary">' + widgetData[1] + '</span>');
    loadStatisticsData(id, period);

    modal.find('#periodBtn input:radio').change(function () {
      period = $(this).val();
      loadStatisticsData(id, period);
    });

    modal.find('#deleteBtn').off('click').click(function () {
      deleteWidget(id);
    });

    modal.find('#editBtn').off('click').click(function () {
      editWidget(id);
    });
  });

  $('#widgetModal').on('hidden.bs.modal', function () {
    $('#widgetModalAlert').hide('fade');
  });

  $('#addWidgetModal').on('hidden.bs.modal', function () {
    const form = $('#addingForm');

    form.find('input[name="id"]').val('');
    form.find('input[name="name"]').val('');
    form.find('input[name="topic"]').val('');
    form.find('input[name="qos"]').val('');
    form.find('input[name="unit"]').val('');

    $('#addWidgetModal').find('.modal-title').text('Add widget');
  });

  $('#saveBtn').click(function () {
    saveWidget();
  });
});
