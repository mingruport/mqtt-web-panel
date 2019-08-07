var config = {
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

var chartCtx = $('#mainChart');
var mainChart = new Chart(chartCtx, config);

function updateChart(chartData) {
  mainChart.data.labels = chartData.date;
  mainChart.data.datasets.forEach(function(dataset) {
    dataset.data = chartData.value;
  });

  mainChart.update();
}

function loadStatisticsData(friendlyId, period) {
  $.ajax({
    url: 'api/timeseries',
    type: 'GET',
    data: {
      friendlyId: friendlyId,
      period: period
    },
    dataType: 'json',
    success: function(response) {
      $('#mainChart').show();
      updateChart(response);
    },
    error: function(error) {
      $('#mainChart').hide();
      $('#topicModalAlert').show('fade');
      $('#topicModalAlert').text(error.responseJSON.message);
    }
  });
}

function loadContent() {
  $.ajax({
    url: 'api/topics',
    type: 'GET',
    success: function(response) {
      var template = $('#contentTemplate').html();
      var rendered = Mustache.render(template, response);
      $('.content').html(rendered);
    }
  });
}

function saveTopic() {
  var form = $('#addingForm');
  var friendlyId = form.find('input[name="friendlyId"]').val();
  var requestMetod = '';
  var requestURL = '';

  if (friendlyId) {
    requestMetod = 'PUT';
    requestURL = 'api/topics/' + friendlyId;
  } else {
    requestMetod = 'POST';
    requestURL = 'api/topics';
  }

  $.ajax({
    url: requestURL,
    type: requestMetod,
    contentType: 'application/json',
    data: JSON.stringify({
      friendly: form.find('input[name="friendly"]').val(),
      topic: form.find('input[name="topic"]').val(),
      unit: form.find('input[name="unit"]').val()
    }),
    dataType: "json",
    success: function() {
      loadContent();
      $('#addTopicModal').modal('hide');
    },
    error: function(error) {
      $('#addTopicModalAlert').show('fade');
      $('#addTopicModalAlert').text(error.responseJSON.message);
    }
  });
}

function editTopic(friendlyId) {
  var form = $('#addingForm');

  $('#topicModal').modal('hide');
  $('#addTopicModal').modal('show');
  $('#addTopicModal').find('.modal-title').text('Edit topic');  

  $.ajax({
    url: 'api/topics/' + friendlyId,
    type: 'GET',
    success: function(response) {
      form.find('input[name="friendlyId"]').val(response.friendlyId),
      form.find('input[name="friendly"]').val(response.friendly),
      form.find('input[name="topic"]').val(response.topic),
      form.find('input[name="unit"]').val(response.unit)
    }
  });
}

function deleteTopic(friendlyId) {
  $.ajax({
    url: 'api/topics/' + friendlyId,
    type: 'DELETE',
    success: function() {
      $('#topicModal').modal('hide');
      loadContent();
    }
  });
}

function updateCardBody(friendlyId, message) {
  var template = $('#cardTextTemplate').html();
  var rendered = Mustache.render(template, message);
  $('#' + friendlyId + ' .card-text').html(rendered);
}

function updateStatus(statusText, statusColor) {
  $('.navbar-text').text(statusText);
  $('.navbar-text').css('color', statusColor);
}

$(function() {
  loadContent();

  var socket = io.connect();

  socket.on('update', function(data) {
    updateCardBody(data.friendlyId, data.message);
  }).on('connect', function() {
    updateStatus('Connected', '#28a745');
  }).on('reconnecting', function() {
    updateStatus('Reconnecting...', '#007bff');
  }).on("disconnect", function() {
    updateStatus('Disconnect', '#dc3545');
  }).on("update_topics", function() {
    loadContent();
  });

  $('#topicModal').on('shown.bs.modal', function(event) {
    var modal = $(this);
    var card = $(event.relatedTarget);
    var friendlyId = card.attr('id');
    var topicData = card.data('whatever').split('^');

    var period = modal.find('#periodBtn label.active input').val();

    modal.find('.modal-title').html(topicData[0] + ' <span class="badge badge-secondary">' + topicData[1] + '</span>');
    loadStatisticsData(friendlyId, period);

    modal.find('#periodBtn input:radio').change(function() {
      period = $(this).val();
      loadStatisticsData(friendlyId, period);
    });

    modal.find('#deleteBtn').off('click').click(function() {
      deleteTopic(friendlyId);
    });

    modal.find('#editBtn').off('click').click(function() {
      editTopic(friendlyId);
    });
  });

  $('#topicModal').on('hidden.bs.modal', function() {
    $('#topicModalAlert').hide('fade');
  });

  $('#addTopicModal').on('hidden.bs.modal', function() {
    var form = $('#addingForm');

    form.find('input[name="friendlyId"]').val('');
    form.find('input[name="friendly"]').val('');
    form.find('input[name="topic"]').val('');
    form.find('input[name="unit"]').val('');

    $('#addTopicModal').find('.modal-title').text('Add topic');
  });

  $('#saveBtn').click(function() {
    saveTopic();
  });
});
