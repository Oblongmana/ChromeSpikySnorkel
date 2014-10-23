console.log('Spiky Snorkel is now running...');

try {
	var showMoreEl = $('img[alt="Show More"]');

	if (showMoreEl.size() === 1) {
		var showAllURL = showMoreEl
			.parent()
			.attr('href') + '9999999';

		var showAllLink = $('<a></a>');

		showAllLink.attr('href', showAllURL);
		showAllLink.text('Show all records');
		$('.fewerMore')
			.html(showAllLink);
	}
} catch (err) {
	console.log('Spiky Snorkel: \'show all\' tweak failed', err);
}


try {
	$('div.pShowMore a:first-child').each(function() {
		var oldHrefDecoded = decodeURIComponent($(this).attr('href'));
		var matchArr = oldHrefDecoded.match(/(javascript:showMoreList\('\/.*', ')(.*)(',.*)/);
		var oldURL = matchArr[2];
		var newURL = oldURL.replace(/rowsperlist=\d+/, 'rowsperlist=1000');
		var newURLEncoded = encodeURIComponent(newURL);
		var newHref = matchArr[1] + newURLEncoded + matchArr[3];
		$(this).attr('href', newHref)
			.text('Show all');
	});
} catch (err) {
	console.log('Spiky Snorkel: \'show all related list\' tweak failed', err);
}


try {
	$('.navLinks .linkElements :contains(Help & Training)').hide()
	var debugLogLink = $('a.debugLogLink');
	$('.navLinks .linkElements').append(debugLogLink);
} catch (err) {
	console.log('Spiky Snorkel: \'nav links\' tweak failed', err);
}


try {
    $('select').each(function() {
        var select = $(this);
        var optionsArr = [];
        var emptyOpt = null;
        $('option', select).each(function() {
            if($(this).text().indexOf('--') !== -1) {
                emptyOpt = $(this);
            } else {
                optionsArr.push($(this));
            }
        });

        optionsArr = _.sortBy(optionsArr, function(opt) {
            return opt.text().toLowerCase();
        });

        $(this).empty();

        $(this).append(emptyOpt);
        $(this).append(optionsArr);
    });
} catch (err) {
    console.log('Spiky Snorkel: \'sort select lists\' tweak failed', err);
}

try {
    var match = document.cookie.match(/\bsid=([^;]+)/);
    if (match) {
      __sfdcSessionId = match[1];
    }

    $.ajax({
        url: '/services/data',
        headers: {
            Authorization: 'Bearer ' + __sfdcSessionId
        },
        success: function(versionsArr) {
            var latestVersion = null;
            for(var i = 0; i < versionsArr.length; i++) {
                var v = versionsArr[i];
                if(latestVersion === null || parseFloat(v.version) > parseFloat(latestVersion.version)) {
                    latestVersion = v;
                }
            }
            var versionSpan = $('<span>')
                .css({
                    'font-weight': 'bold',
                    'color': 'white',
                    'text-shadow': '-1px 0 DimGray, 0 1px DimGray, 1px 0 DimGray, 0 -1px DimGray',
                    'margin-left': '4px'
                })
                .text(latestVersion.label + ' (' + latestVersion.version + ')');
            $('.bPageHeader .phHeader td.left')
                .append(versionSpan)
                .css('padding-bottom', '2px');
        }
    });
} catch (err) {
    console.log('Spiky Snorkel: \'get Salesforce version\' tweak failed', err);
}
