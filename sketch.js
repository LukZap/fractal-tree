var interval;
var rootPoint = new Point(500,500);
var branchArrays = {};
var branchOptions = {
    rootBranchLength: 150,
    growFactor: 700, // divided by 1000
    newBranchMaxAngle: 60, // in deg
    newBranchesEveryStep: 3,
    branchLayersCount: 9,
    randomAngle: true,
    layerColors: [],

    branchRandomLength: true,
    branchRandomFactor: 0.5,

    branchAngleRandomness: -0.5,
}

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

//UI elements
var sliderBranchLayersCount;
var sliderAngle;
var sliderNewBranchesEveryStep;
var sliderGrowFactor;
var checkboxAutoChange;
var checkboxRandomAngle;

function setup() {
    createCanvas(1000, 1000);
    pickRandomColors();
    createUIElements();
    nextTreeFromSliderParams();
}

function draw() {
    drawTextLabels();

    // draw trees
    for (var branches in branchArrays) {
        branchArrays[branches].forEach(branch => {
            stroke(branchOptions.layerColors[branches]);
            line(branch.startPoint.x, branch.startPoint.y, branch.endPoint.x, branch.endPoint.y);
        });
    }
}

function pickRandomColors() {
    branchOptions.layerColors = [];
    for (let index = 0; index < 11; index++) {
        branchOptions.layerColors.push(random(colorArray));        
    }
}

function createUIElements() {
    sliderBranchLayersCount = createSlider(1, 10, branchOptions.branchLayersCount);
    sliderBranchLayersCount.position(0, 0);
    sliderBranchLayersCount.style('width', '200px');
    sliderBranchLayersCount.changed(nextTreeFromSliderParams);

    sliderAngle = createSlider(0, 90, branchOptions.newBranchMaxAngle);
    sliderAngle.position(0, 30);
    sliderAngle.style('width', '200px');
    sliderAngle.changed(nextTreeFromSliderParams);

    sliderNewBranchesEveryStep = createSlider(1, 10, branchOptions.newBranchesEveryStep);
    sliderNewBranchesEveryStep.position(0, 60);
    sliderNewBranchesEveryStep.style('width', '200px');
    sliderNewBranchesEveryStep.changed(nextTreeFromSliderParams);

    sliderGrowFactor = createSlider(1, 1000, branchOptions.growFactor);
    sliderGrowFactor.position(0, 90);
    sliderGrowFactor.style('width', '200px');
    sliderGrowFactor.changed(nextTreeFromSliderParams);

    sliderBranchAngleRandomness = createSlider(-10, 10, branchOptions.branchAngleRandomness);
    sliderBranchAngleRandomness.position(0, 120);
    sliderBranchAngleRandomness.style('width', '200px');
    sliderBranchAngleRandomness.changed(nextTreeFromSliderParams);

    checkboxAutoChange = createCheckbox('auto change every 2s', false);
    checkboxAutoChange.position(0, 150);
    checkboxAutoChange.changed(checkedAutoChange);

    checkboxRandomAngle = createCheckbox('random angle', branchOptions.randomAngle);
    checkboxRandomAngle.position(0, 180);
    checkboxRandomAngle.changed(checkedRandomAngle);
}

function drawTextLabels() {
    stroke(100);
    text(`Number of branch layers: ${sliderBranchLayersCount.value()}`, sliderBranchLayersCount.x * 2 + sliderBranchLayersCount.width,
         sliderBranchLayersCount.y + 10);
    text(`Angle: ${sliderAngle.value()} deg`, sliderAngle.x * 2 + sliderAngle.width, sliderAngle.y + 10);
    text(`New branches every layer: ${sliderNewBranchesEveryStep.value()}`,
         sliderNewBranchesEveryStep.x * 2 + sliderNewBranchesEveryStep.width, sliderNewBranchesEveryStep.y + 10);
    text(`Grow factor: ${sliderGrowFactor.value()/1000}`, sliderGrowFactor.x * 2 + sliderGrowFactor.width, sliderGrowFactor.y + 10);
    text(`Branch angle randomness: ${sliderBranchAngleRandomness.value()/50}`,
        sliderBranchAngleRandomness.x * 2 + sliderBranchAngleRandomness.width, sliderBranchAngleRandomness.y + 10);
}

function checkedAutoChange() {
  if (this.checked()) {
    nextTreeFromSliderParams();
    interval = setInterval(nextTreeFromSliderParams, 2000);
  } else {
    clearInterval(interval);
    interval = null;
  }
}

function checkedRandomAngle() {
    if (this.checked()) {
        branchOptions.randomAngle = true;
        sliderNewBranchesEveryStep.show();
    } else {
        branchOptions.randomAngle = false;
        sliderNewBranchesEveryStep.value(2);
        sliderNewBranchesEveryStep.hide();
    }
    nextTreeFromSliderParams();
}

function nextTreeFromSliderParams() {
    clear();
    branchOptions.branchLayersCount = sliderBranchLayersCount.value();
    branchOptions.newBranchMaxAngle = (sliderAngle.value() / 180) * Math.PI;
    branchOptions.newBranchesEveryStep = sliderNewBranchesEveryStep.value();
    branchOptions.growFactor = sliderGrowFactor.value()/1000;
    branchOptions.branchAngleRandomness = sliderBranchAngleRandomness.value()/50;
    calculateBranches(branchOptions);
}

function calculateBranches(b) {
    branchArrays = {};

    //first branch
    branchArrays['1'] = [];
    var startPoint = rootPoint;
    var endPoint = new Point(rootPoint.x, rootPoint.y - b.rootBranchLength);
    branchArrays['1'].push(new Branch(startPoint, endPoint));

    //new layer of branches
    for (let layerIndex = 2; layerIndex <= b.branchLayersCount; layerIndex++) {

        var previousBranchLayer = (layerIndex - 1).toString();
        var currentBranchLayer = layerIndex.toString();
        branchArrays[currentBranchLayer] = [];

        //for every branch from last layer...
        for (let branchIndex = 0; branchIndex < branchArrays[previousBranchLayer].length; branchIndex++) {
            var branch = branchArrays[previousBranchLayer][branchIndex];
            var last_startPoint = branch.startPoint;
            var last_endPoint = branch.endPoint;
            var last_angle = PointHelper.CalculateAngleFromPoints(last_startPoint, last_endPoint);
            var last_length = PointHelper.CalculateLengthFromPoints(last_startPoint, last_endPoint);
            var new_length = last_length * b.growFactor;

            //...calc new branches
            for (let i = 0; i < b.newBranchesEveryStep; i++) {
                let randomAngle;

                if(b.randomAngle)
                    randomAngle =  2 * Math.random() * b.newBranchMaxAngle - b.newBranchMaxAngle;
                else
                    randomAngle = i%2 == 0 ? b.newBranchMaxAngle : -b.newBranchMaxAngle;

                var new_length_r = b.branchRandomLength ?
                    new_length * (1.1 - b.branchRandomFactor * (1 -  Math.random())) : new_length;  

                var new_angle = last_angle + randomAngle + Math.random() * b.branchAngleRandomness;
                var new_startPoint = new Point(last_endPoint.x, last_endPoint.y);
                var new_endPoint = new Point(last_endPoint.x + new_length_r * Math.cos(new_angle),
                    last_endPoint.y - new_length_r * Math.sin(new_angle));

                branchArrays[currentBranchLayer].push(new Branch(new_startPoint, new_endPoint));
            }
        }
    }
}
