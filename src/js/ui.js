var Ui = new function() {
    $('#build').click(function() {
        App.debug('Build tool selected.');
        App.selectedTool = App.Tool.build;
    });
    
    $('#demolish').click(function() {
        App.debug('Demolish tool selected.');
        App.selectedTool = App.Tool.demolish;
    });
    
    $('#zoomin').click(function() {
        App.debug('Zooming in.');
        // TODO: Create zoom in functionality.
    });
    
    $('#zoomout').click(function() {
        App.debug('Zooming out.');
        // TODO: Create zoom out functionality.
    });
    
    $('#tools').buttonset();
    
    $('.button').button();
    
    $('#buildDialog').dialog({
        autoOpen: false,
        show: "explode",
        hide: "explode"
    });
    
    $('#build').click(function() {
        $( "#buildDialog" ).dialog("open");
    });
    
    $('.buildOption').click(function() {
        // TODO: Set the building as the currently set build option
    });
    
    $('#cinema').click(function() {
        App.selectedBuilding = Buildings.cinema;
        $('#buildDialog').dialog('close');
        return false;
    });
    
    $('#icecream').click(function() {
        App.selectedBuilding = Buildings.icecream;
        $('#buildDialog').dialog('close');
        return false;
    });
}