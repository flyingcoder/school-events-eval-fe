import { Component, OnInit } from '@angular/core';
import { EvaluationsService } from '../../../services/evaluations/evaluations.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

  evaluations;
  selectedEval;
  criterias = [];
  form;
  evalId = null;
  user;
  update = false;
  enableForm: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'created', 'actions'];

  constructor(
    private evalSrv: EvaluationsService,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.getAll();
  }

  csvExport() {

    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'School Evaluations',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
     
    csvExporter.generateCsv(this.evaluations.filteredData);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.evaluations.filter = filterValue.trim().toLowerCase();
  }

  getAll(){
    if(localStorage.getItem('type') == '1'){
      this.evalSrv.all().subscribe(evaluations => {
        this.evaluations = new MatTableDataSource(evaluations)
      });
    } else if(localStorage.getItem('type') == '2'){
      this.evalSrv.allPerUser(this.user).subscribe(evaluations => {
        this.evaluations = new MatTableDataSource(evaluations)
      });
    }
    this.form = this.builder.group(
      {name: ['', Validators.required]},
      {user_id: ''}
    );
  }

  store(evaluation){
    evaluation.user_id = this.user;
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    if(this.form.valid){
      if(!this.update){
        this.evalSrv.store(evaluation).subscribe(data => {
          this.evalId = data.id
          Toast.fire({
            icon: 'success',
            title: 'Evaluation successfully added.'
          })
        });
      } else {
        this.evalSrv.update(evaluation, this.evalId).subscribe(data => {
          Toast.fire({
            icon: 'success',
            title: 'Evaluation updated successfully.'
          })
        });
      }
    }
  }

  delete(evaluation){
    Swal.fire({
      title: 'Delete ' + evaluation.name,
      text: evaluation.name + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.evalSrv.destroy(evaluation.id).subscribe(data => {
          this.getAll()
        });
      }
    });
  }

  edit(evaluation){
    this.form.patchValue({name: evaluation.name, user_id: evaluation.user_id});
    this.evalId = evaluation.id;
    this.update = true;
    this.enableForm = true;
    this.evalSrv.show(this.evalId).subscribe(evaluation => {
      this.criterias = evaluation.criterias
    });
  }

  deleteCriteria(criteria, key){
    Swal.fire({
      title: 'Delete criteria: ' + criteria.value,
      text: 'Criteria '+ criteria.value + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.evalSrv.destroyCriteria(criteria.id).subscribe(data => {
          this.criterias.splice(key, 1)
        });
      }
    });
  }

  deleteSubcriteria(subcriteria, i, x){
    Swal.fire({
      title: 'Delete subcriteria: ' + subcriteria.value,
      text: 'Subcriteria '+ subcriteria.value + ' will be deleted from permanently. Are you sure?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        this.evalSrv.destroySubcriteria(subcriteria.id).subscribe(data => {
          this.criterias[i].subcriterias.splice(x, 1)
        });
      }
    });
  }

  async openCriteriaDialog(){
    const { value: criteria } = await Swal.fire({
      title: 'Add new criteria',
      input: 'textarea',
      inputPlaceholder: 'Enter your criteria here'
    })

    if (criteria) {
      this.evalSrv.storeCriteria({value: criteria, eval_id: this.evalId}).subscribe(data => {
        data.subcriterias = []
        this.criterias.push(data)
      });
    }
    console.log(this.criterias);
  }

  async addSubcriteria(criteria, key){
    const { value: subcriteria } = await Swal.fire({
      title: 'Add a subcriteria',
      input: 'textarea',
      inputPlaceholder: 'Enter your subcriteria here'
    })

    if(subcriteria){
      this.evalSrv.storeSubcriteria({value: subcriteria, criteria_id: criteria}).subscribe(data => {
        this.criterias[key].subcriterias.push(data);
      });
    }
  }

}
