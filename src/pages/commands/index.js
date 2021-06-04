Office.initialize = function (reason) {
    // If you need to initialize something you can do so here.
    console.log(reason);
};

Office.onReady(() => {
    // If needed, Office.js is ready to be called
});

Object.assign((self || window || global), {
    openOnlineWeb(event) {
        // Implement your custom code here. The following code is a simple example.  
        Office.context.document.setSelectedDataAsync(
            `ExecuteFunction works. Button ID=${event.source.id}. ${new Date().toLocaleString()}`,
            function (asyncResult) {
                var error = asyncResult.error;
                if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                    // Show error message.
                    console.error(error);
                }
                else {
                    // Show success message.
                }
            });
        Office.context.ui.openBrowserWindow("https://season-studio.github.io/");
  
        // Calling event.completed is required. event.completed lets the platform know that processing has completed.
        event.completed();
    }
});