import { Component, OnInit, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from "src/app/services/common.service";


@Component({
  selector: "app-skillDashboard",
  templateUrl: "./skillDashboard.component.html",
  styleUrls: ["./skillDashboard.component.scss"]
})

export class SkillDashboardComponent implements OnInit {
  toppings: FormGroup;
  levelview = false;
  levela = false;
  sklio = false;
  skliopath = false;
  skliojob = false;
  jobddl = true;
  roleddl = false;
  skillsddl = false;
  checkValue: any;
  stepCount: number;
  totalCount: number;
  btninfo = 'Next';
  htxtinfo = 'Path';

  single= [  { "name": "DevOps Engineer", "value": 42 } ];
  multi= [  { "name": "DevOps Engineer", "value": 20 } ];
  piechart= [  { "name": "Germany", "value": 8940000 } ];
  view: any[] = [100, 40];
  

  series = [
    {
      "name": "Software Architect",
      "value": 20,
      "label": "20%"
    },
    {
      "name": "Sr. Full Stack Developer",
      "value": 70,
      "label": "70%"
    },
    {
      "name": "Sr. Software Architect",
      "value": 10,
      "label": "10%"
    }
  ];

  pieChartLabel(series: any[], name: string): string {
      const item = series.filter(data => data.name === name);
      if (item.length > 0) {
        return item[0].label; 
      }
      return name;
  }

  formatLabel(value: number) {
    if (value >= 10) {
      return Math.round(value / 600) + 'k';
    }
    return value;
  }

  selectedValue: string;
  selectedskills: string;
  domainlist :any;
  roles: any;

  skillset = [
    { value: 'steak-0', viewValue: 'Data Structures', checked: false },
    { value: 'Node', viewValue: 'Node JS', checked: false },
    { value: 'Express', viewValue: 'Express', checked: false },
    { value: 'Boostrap', viewValue: 'Boostrap', checked: false },
    { value: 'HTML', viewValue: 'HTML', checked: false },
    { value: 'JavaScript', viewValue: 'JavaScript', checked: false },
    { value: 'MongoDB', viewValue: 'MongoDB', checked: false },
    { value: 'React', viewValue: 'React', checked: false },
    { value: 'Architecture', viewValue: 'Web Architecture', checked: false },
    { value: 'Python', viewValue: 'Python', checked: false },
    { value: 'jQuery', viewValue: 'jQuery', checked: false },
    { value: 'GitHub', viewValue: 'GitHub', checked: false },
    { value: 'Ruby', viewValue: 'Ruby and Rails', checked: false },
    { value: 'CSS', viewValue: 'CSS', checked: false },
    { value: 'REST', viewValue: 'REST API', checked: false }
  ];

  seletorBox = [
    { name: 'Job', class: ' icon-Job', checked: true },
    { name: 'Role', class: ' icon-Role', checked: false },
    { name: 'Skills', class: ' icon-Benchmark', checked: false }
  ];

  constructor(public dialog: MatDialog, public fb: FormBuilder, public commonServ: CommonService) {

    this.getjobs();
    this.getrole();
    this.toppings = fb.group({
      pepperoni: false,
      extracheese: false,
      mushroom: false
    });

  }

  getrole() {
    this.commonServ.getroleDetails().subscribe((resp: any) => {
      this.roles = resp.data;
    })
  }

  getjobs(){
    this.commonServ.getjobDetails().subscribe((resp:any)=>{
      this.domainlist = resp.data;
    })
  }

  ngOnInit() {

  }

  modal_(templateRef: TemplateRef<any>,) {
    this.dialog.open(templateRef, {
      width: '65%',
      height: '85%',
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'skils_dialog'
    });
    this.stepCouter();
  }
  stepCouter() {
    this.stepCount++;
    if (this.selectedValue == 'Information' || this.selectedValue == 'backend') {
      this.levela = true;
      this.levelview = true;
      if (this.stepCount >= 2) {
        this.btninfo = ' Finish';
      }
      if (this.stepCount === 3) {
        this.sklio = true;
        this.skliopath = true;
        this.skliojob = false;
        this.closedialog();
      }
    }

    if (this.selectedValue == 'srsoftware') {
      this.btninfo = ' Next';
      this.levelview = true;
      this.levela = true;
      if (this.stepCount >= 3) {
        this.btninfo = ' Finish';
      }
      if (this.stepCount === 4) {
        this.sklio = true;
        this.skliojob = true;
        this.skliopath = false;
        this.closedialog();
      }
    }
  }
  closedialog() {
    this.dialog.closeAll();
    this.stepCount = 1;
    this.btninfo = ' Next';
  }
  selectnext() {
    this.levelview = true;
  }
  selectback() {
    this.stepCount -= 1;
    this.btninfo = ' Next';
    if (this.selectedValue == 'Information' || this.selectedValue == 'backend') {
      this.levela = false;
      this.levelview = false;
    }
  }
  onItemChange(e) {
    this.checkValue = e.name;
    if (this.checkValue == 'Job') {
      this.selectedValue = 'srsoftware';
      this.jobddl = true;
      this.roleddl = false;
      this.skillsddl = false;
    }
    if (this.checkValue == 'Role') {
      this.selectedValue = 'backend';
      this.selectedskills = 'MEAN';
      this.jobddl = true;
      this.roleddl = true;
      this.skillsddl = false;
    }
    if (this.checkValue == 'Skills') {
      this.selectedValue = 'Information';
      this.selectedskills = 'Java';
      this.skillsddl = true;
      this.jobddl = false;
      this.roleddl = false;
    }

  }
  reset(): void {
    window.location.reload();
  }
}
