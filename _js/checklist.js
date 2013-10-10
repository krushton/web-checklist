$(document).ready(function() {

    load();
    
    //when a tab is clicked, show the matching div
    $('#tabs a').click(function() {
        var target = $(this).attr('href');
        $('#quiz > div').hide();
        $('#tabs a').each(function() {
            $(this).parent().removeClass('active');
        });
        $(target).show();
        $(this).parent().addClass('active');
        return false;
    });
    
    $('#clear').click(function() {
        clear();
    });
    

});

//clears the form and localstorage
function clear() {
    var sure = confirm('Are you sure?');
    if (sure) {  
        localStorage['answers'] = '[]';
        load();
        calculate();
    }
}

//calculate current quiz score
function calculate() {
    var totalScore = 0;
    $(':checked').each(function() {
        var chr = $(this).val();
        if (chr === "sometimes") {
            totalScore += 1;
        } else if (chr === "always") {
            totalScore += 2;
        }
    });
    $('#score').text(totalScore);
}

//save to local storage
function save() {
    var answers = [];
    $('.answer').each(function(index, element) {
        var id = $(this).attr('id');
        var selected = $(this).find(':checked').first().attr('id') || null;
        answers.push( {id : id, sel: selected});
    });
    var ans = JSON.stringify( answers );
    localStorage['answers'] = JSON.stringify( answers );
}

//load from local storage
function load() {

    localStorage['answers'] = localStorage['answers'] || '[]';
    var answers = JSON.parse( localStorage['answers'] );
    
    $('#quiz li').each(function(index,item) {
    
        var el = $(this).find('.answer');
        if (el) {
            el.remove();
        }
        
        var m = answers[index];

        if (m) {
            $(this).append(buildQuizAnswerDiv(index, m.sel));
        } else {
            $(this).append(buildQuizAnswerDiv(index));
        }
    });
    
    calculate();
 
}


//creates a radio button control
function buildQuizAnswerDiv(index, selectedId) {
    
    var name = "q-" + index;
    var id = "a" + index;

    var ans = $('<div class="answer" id="' + name + '"></div>')
        .append('<input type="radio" id="' + id + '-opt1" name="' + name 
            + '" value="never"><label for="' + id + '-opt1"> Never<label>')
        .append('<input type="radio" id="' + id + '-opt2" name="' + name 
            + '" value="sometimes"><label for="' + id + '-opt2"> Sometimes</label>')
        .append('<input type="radio" id="' + id + '-opt3" name="' + name 
            + '" value="always"><label for="'+ id + '-opt3"> Always</label>');
        
    if (selectedId) {
       ans.find('#' + selectedId).prop('checked', true);
    }
        
    ans.find('input').change(function() {
        calculate();
        save();
    });
    
    return ans;
}
