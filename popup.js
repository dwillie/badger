var configField = document.getElementById("config-field");
var configEditor = ace.edit(configField);
configEditor.setTheme("ace/theme/monokai");
configEditor.getSession().setMode("ace/mode/json");

loadConfig = function() {
   chrome.storage.sync.get("badgerConfig", function(result) {
       configEditor.setValue(result.badgerConfig);
   });
};

saveConfig = function() {
    chrome.storage.sync.set({ "badgerConfig": configEditor.getValue() });
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        chrome.tabs.reload(arrayOfTabs[0].id);
    });
};

document.getElementById("save-button").onclick = saveConfig;
loadConfig();
