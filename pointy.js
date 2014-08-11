getCardText = function(card) {
    return card.getElementsByClassName("js-card-name")[0].innerHTML;
}

setCardText = function(card, text) {
    return card.getElementsByClassName("js-card-name")[0].innerHTML = text;
}

addTag = function(card, tagText) {
    tag = document.createElement("span");
    tag.classList.add("tag");
    tag.innerHTML = tagText;

    console.log("Adding tag");
    card.innerHTML += tag.outerHTML
}

processList = function(list) {
    scoreMatcher = new RegExp(/\((.*)\)/g);
    cards = list.getElementsByClassName("list-card");
    for (var i = 0; i < cards.length; i++)
    {
        cardText   = getCardText(cards[i]);
        regexMatch = scoreMatcher.exec(cardText);
        if (regexMatch === null || regexMatch === undefined) {
            continue;
        }

        cardScore  = regexMatch[1];
        setCardText(cards[i], cardText.replace(regexMatch[0], ""));
         addTag(cards[i], cardScore);
    }
}

main = function() {
    lists = document.getElementsByClassName("list");
    for (var i = 0; i < lists.length; i++) {
        processList(lists[i]);
    }

    // setTimeout(main, 1000);
}

window.onload = main
