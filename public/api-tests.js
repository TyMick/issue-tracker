$(function() {
  function getFormDataObject(formId) {
    return $("#" + formId)
      .serializeArray()
      .reduce(function(object, item) {
        object[item.name] = item.value;
        return object;
      }, {});
  }

  function serializeWithoutBlanks(formId) {
    return $("#" + formId + " :input")
      .filter(function(index, element) {
        return $(element).val() != "";
      })
      .serialize();
  }

  function displayResult(result) {
    $("#apiOutput").text(JSON.stringify(result, null, 2));
    hljs.highlightBlock(document.getElementById("apiOutput"));
    $("#apiOutputModal").modal("show");
  }

  $("#addNewIssue").submit(function() {
    event.preventDefault();
    if ($("#projectName").val()) {
      $("button").attr("disabled", true);
      $("button", this).html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Uploading...</span>'
      );
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "post",
        data: getFormDataObject("addNewIssue"),
        success: function(result) {
          displayResult(result);
          $("#addNewIssue button").html("POST");
          $("button").removeAttr("disabled");
        }
      });
    } else {
      $("#projectName").focus();
    }
  });

  $("#getIssues").submit(function() {
    event.preventDefault();
    if ($("#projectName").val()) {
      $("button").attr("disabled", true);
      $("button", this).html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Uploading...</span>'
      );
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "get",
        data: serializeWithoutBlanks("getIssues"),
        success: function(result) {
          displayResult(result);
          $("#getIssues button").html("GET");
          $("button").removeAttr("disabled");
        }
      });
    } else {
      $("#projectName").focus();
    }
  });

  $("#updateIssue").submit(function() {
    event.preventDefault();
    if ($("#projectName").val()) {
      $("button").attr("disabled", true);
      $("button", this).html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Uploading...</span>'
      );
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "put",
        data: getFormDataObject("updateIssue"),
        success: function(result) {
          displayResult(result);
          $("#updateIssue button").html("PUT");
          $("button").removeAttr("disabled");
        }
      });
    } else {
      $("#projectName").focus();
    }
  });

  $("#deleteIssue").submit(function() {
    event.preventDefault();
    if ($("#projectName").val()) {
      $("button").attr("disabled", true);
      $("button", this).html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Uploading...</span>'
      );
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "delete",
        data: getFormDataObject("deleteIssue"),
        success: function(result) {
          displayResult(result);
          $("#deleteIssue button").html("DELETE");
          $("button").removeAttr("disabled");
        }
      });
    } else {
      $("#projectName").focus();
    }
  });
});
