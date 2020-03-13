import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswersService } from '../../../../services/answers/answers.service';
import { EventsService } from '../../../../services/events/events.service';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  panelOpenState = false;
  answers = [];
  event;
  id;
  ready: boolean = false;
  reports = [];
  respondentsCount = 0;
  respondents;
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: '',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['Criteria', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Mean']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private answerSrv: AnswersService,
    private eventSrv: EventsService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.answerSrv.getAnswers(this.id).subscribe(answers => {
      this.answers = this.sanitizedAnswers(answers)
      if(this.answers.length > 0){
        this.generateReport(this.answers)
        this.respondentsCount = this.answers.length;
      }
      console.log(this.answers)

      this.eventSrv.show(this.id).subscribe(event => {
        this.event = event
        this.ready = true
      });
    });

    this.eventSrv.get(this.id).subscribe(event => {
      this.respondents = event;
    });

  }

  sanitizedAnswers(answers){
    answers.forEach(element => {
      element.answers = JSON.parse(element.answers)
      element.average = this.getAverage(element.answers)
    });

    return answers;
  }

  generateReport(answers){


    answers[0].answers.forEach(element => {
      var subs = [];
      if(element.subcriterias.length > 0){
        element.subcriterias.forEach(subcriteria => {
          subs.push({id: subcriteria.id, value: subcriteria.value, total: []})
        })
      }
      console.log('Subs', subs);
      this.reports.push({id: element.id, value: element.value, total: [], subcriterias: subs})
    });


    this.reports.forEach(report => {
      var total = [0, 0, 0, 0, 0];
      var subtotal = [0, 0, 0, 0, 0];
      answers.forEach(entry => {
        entry.answers.forEach(answer => {
          if(report.id == answer.id){
            var i = parseInt(answer.answer) - 1;
            total[i] = total[i] + 1;
            if(answer.subcriterias.length > 0){
              answer.subcriterias.forEach(subcriteria => {
                if(answer.id == subcriteria.criteria_id){
                  var i = parseInt(subcriteria.answer) - 1;
                  total[i] = total[i] + 1;
                }
              })
            }
          }
        })
      })
      report.total = total

    });

    console.log('Reports', this.reports);
  }


  getAverage(answers){
    var length = answers.length;
    var total = 0;
    console.log(answers);
    answers.forEach(element => {
      if(element.subcriterias.length > 0){
        total = total + 0
        length = length - 1
      } else {
        total = total + parseInt(element.answer)
      }
    });

    return total / length;
  }

  getPercentage(value){
    return Math.round((value / this.respondentsCount) * 100) + '%';
  }

  getMean(values){
    var total = 0;
    var rating = [1, 2, 3, 4, 5];
    for (var i = 0; i < values.length; i++) {
        total += values[i] * rating[i];
    }
    console.log(total);
    return parseFloat((total / this.respondentsCount).toFixed(2));
  }
  getResponseRate(){
    return (this.respondentsCount / this.respondents.length) * 100;
  }

  getTotalMean(){
    var total = 0;
    this.reports.forEach(report => {
      total = total + this.getMean(report.total)
    });
    return (total / this.reports.length).toFixed(2);
  }

  generateCSV(){
    this.options.title = this.event.name;
    var data = [];

    this.reports.forEach(report => {
      console.log(report)
      var entry = {criteria: '', excellent:'', verygood:'', good: '', fair:'', poor:'', mean: 0}
      entry.criteria =  report.value
      entry.excellent = this.getPercentage(report.total[4])
      entry.verygood = this.getPercentage(report.total[3])
      entry.good = this.getPercentage(report.total[2])
      entry.fair = this.getPercentage(report.total[1])
      entry.poor = this.getPercentage(report.total[0])
      entry.mean = this.getMean(report.total)
      data.push(entry)
    });

    const csvExporter = new ExportToCsv(this.options);
    csvExporter.generateCsv(data);
  }

}
