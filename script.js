const BASE_API = 'https://c324-182-253-183-10.ap.ngrok.io/';
const MAX_FILES = 3;
let DATA_CEK_PEAK = [];
let DATA_PEAK_DETECTION = [];
let DATA_PLOT_RRI = [];
let DATA_PLOT_SINGLE = [];
let FILE_NAME_DATA = [];
let PEAK_ALL_DATA = [];
let DATA_PLOT_MULTI = '';

let numberPosition = 1;
let indexPosition = 0;

function uploadFile(event) {
    event.preventDefault();

    DATA_CEK_PEAK = [];
    DATA_PEAK_DETECTION = [];
    DATA_PLOT_RRI = [];
    DATA_PLOT_SINGLE = [];
    FILE_NAME_DATA = [];
    PEAK_ALL_DATA = [];
    DATA_PLOT_MULTI = '';
    numberPosition = 1;
    indexPosition = 0;

    $('.button-data').removeClass('btn-secondary');
    $('.button-data').addClass('btn-outline-secondary');
    $('.button-data-0').removeClass('btn-outline-secondary');
    $('.button-data-0').addClass('btn-secondary');

    const files = document.getElementById('file').files;

    if (files.length > MAX_FILES) {
        $('#fileWarning').show();
        return false;
    } else {
        $('#fileWarning').hide();
    }

    showingLoading();

    uploadProccess(files[indexPosition]);
}

function uploadProccess(file) {
    PEAK_ALL_DATA.push(file);
    const files = document.getElementById('file').files;
    const formData = new FormData();
    formData.append('file', file);
    $.ajax({
        url: `${BASE_API}upload`,
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            DATA_CEK_PEAK.push(response.pCeak);
            DATA_PEAK_DETECTION.push(response.pDetection);
            DATA_PLOT_RRI.push(response.pRri);
            DATA_PLOT_SINGLE.push(response.pSingle);
            FILE_NAME_DATA.push(response.fileName);

            // 3 : 3
            if (numberPosition === files.length) {
                if (files.length === MAX_FILES) {
                    proccessMultiCarePlot();
                } else {
                    processDone();
                }
            } else {
                indexPosition++;
                uploadProccess(files[indexPosition]);
            }

            numberPosition++;
        }
    });
}

function proccessMultiCarePlot() {
    const formData = new FormData();
    for (let i = 0; i < MAX_FILES; i++) {
        formData.append('file[]', PEAK_ALL_DATA[i]);
    }
    $.ajax({
        url: `${BASE_API}prosesMultiCarePlot`,
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            processDone();
            DATA_PLOT_MULTI = response.url;
        }
    });
}

function processDone() {
    $('.dummy-img-container').hide();
    $('.real-data-container').show();

    $('#data1').html(DATA_CEK_PEAK[0]);
    $('#data2').html(DATA_PEAK_DETECTION[0]);
    $('#data3').html(DATA_PLOT_RRI[0]);
    $('#data4').html(DATA_PLOT_SINGLE[0]);

    $('#fileNameInfo').removeClass('alert-danger');
    $('#fileNameInfo').addClass('alert-info');
    $('#fileNameInfo').text(FILE_NAME_DATA[0]);

    showingLoading(false);
}

function buttonClicked(index) {
    if (index === MAX_FILES && DATA_PLOT_MULTI !== '') {
        $('#fileNameInfo').removeClass('alert-danger');
        $('#fileNameInfo').addClass('alert-info');
        $('#fileNameInfo').text(FILE_NAME_DATA[index]);

        $('#fileNameInfo').text(FILE_NAME_DATA);
        $('#dataPeak').prop('src', `${BASE_API}${DATA_PLOT_MULTI}`);
        $('#multiPeak').show();
        $('#normalPeak').hide();
    } else if (FILE_NAME_DATA[index]) {
        $('#fileNameInfo').removeClass('alert-danger');
        $('#fileNameInfo').addClass('alert-info');
        $('#fileNameInfo').text(FILE_NAME_DATA[index]);

        $('#dataPeak').html('');
        $('#multiPeak').hide();
        $('#normalPeak').show();

        $('#data1').html(DATA_CEK_PEAK[index]);
        $('#data2').html(DATA_PEAK_DETECTION[index]);
        $('#data3').html(DATA_PLOT_RRI[index]);
        $('#data4').html(DATA_PLOT_SINGLE[index]);
    } else {
        $('#fileNameInfo').removeClass('alert-info');
        $('#fileNameInfo').addClass('alert-danger');
        $('#fileNameInfo').text('gal adaa woi');
    }

    $('.button-data').removeClass('btn-secondary');
    $('.button-data').addClass('btn-outline-secondary');
    $(`.button-data-${index}`).removeClass('btn-outline-secondary');
    $(`.button-data-${index}`).addClass('btn-secondary');
}

function showingLoading(isTrue = true) {
    if (isTrue) {
        $('.loading').show();
    } else {
        $('.loading').hide();
    }
}
