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
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "post",
        data: getFormDataObject("addNewIssue"),
        success: displayResult
      });
    } else {
      $("#projectName").focus();
    }
  });

  $("#getIssues").submit(function() {
    event.preventDefault();
    if ($("#projectName").val()) {
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "get",
        data: serializeWithoutBlanks("getIssues"),
        success: displayResult
      });
    } else {
      $("#projectName").focus();
    }
  });

  $("#updateIssue").submit(function() {
    event.preventDefault();
    if ($("#projectName").val()) {
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "put",
        data: getFormDataObject("updateIssue"),
        success: displayResult
      });
    } else {
      $("#projectName").focus();
    }
  });

  $("#deleteIssue").submit(function() {
    event.preventDefault();
    if ($("#projectName").val()) {
      $.ajax({
        url: "/api/issues/" + $("#projectName").val(),
        type: "delete",
        data: getFormDataObject("deleteIssue"),
        success: displayResult
      });
    } else {
      $("#projectName").focus();
    }
  });
});
