$(function() {
  // takes in JS representation of a task
  // and produces an HTML representation
  // using <li> tags
  function taskHTML(task) {
    var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done ? "completed" : "";
    var liElement = '<li id="listItem-' + task.id + '" class="'+ liClass + '"><div class="view"><input class="toggle" type="checkbox" data-id="' + task.id + '"' + checkedStatus + '><label>' + task.title + '</label></div></li>';

    return liElement;
  }

  // gets item ID and the done value (in
  // Boolean form) of a task when the
  // user checks or unchecks it.
  // Then the post method is called to
  // update the task with the new value
  function toggleTask(e) {
    var itemID = $(e.target).data('id');

    var doneValue = Boolean($(e.target).is(':checked'));

    $.post('/tasks/' + itemID, {
      _method: 'PUT',
      task: {
        done: doneValue
      }
    }).success(function(data) {
      var liHTML = taskHTML(data);
      var $li = $('#listItem-' + data.id);
      $li.replaceWith(liHTML);
      $('.toggle').change(toggleTask);
    });
  }

  $.get("/tasks").success( function( data ) {
    var htmlString = '';
    $.each(data, function(index, task) {

      htmlString += taskHTML(task);
    });
    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);

    $('.toggle').change(toggleTask);
  });

  $('#new-form').submit(function(e) {
    e.preventDefault();
    var todo = $(this).children().val();
    var payload = {
      task: {
        title: todo
      }
    };

    $.post('/tasks', payload).success(function(data) {
      var htmlString = taskHTML(data);
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.toggle').click(toggleTask);
      $('.new-todo').val('');
    });
  });
});
