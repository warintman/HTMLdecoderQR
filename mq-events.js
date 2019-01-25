(function () {
    var mqEvents = function (mediaChangeHandler) {
        var sheets = document.styleSheets;

        // Use the provided handler if present
        if (!mediaChangeHandler) {
            console.error('mqEvents necesita mediaChangeHandler.');
            return false;
        }

        if (sheets.length>0) {
            for (var i = 0; i < sheets.length; i += 1) {
                var rules;
                try {
                    rules =  sheets[i].cssRules || sheets[i].rules;              
                } catch(e) {
                    if(e.name !== "SecurityError") {
                        throw e;
                    }
                    return;
                }  
                if (rules && rules.length>0) {
                    for (var j = 0; j < rules.length; j += 1) {
                        // This Stackoverflow answer helped me figure out how
                        // to check the type of object each rule was
                        // http://stackoverflow.com/a/332429/368634
                        if (rules[j].constructor === CSSMediaRule) {
                            var mql = window.matchMedia(rules[j].media.mediaText);
                            mql.addListener(mediaChangeHandler);
                            mediaChangeHandler(mql);
                        }
                    }
                }
            }
        }
    };

    // Yeah, this is a little shitty
    window.mqEvents = mqEvents;
}());