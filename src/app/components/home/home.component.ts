import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { CustomToastyService } from '../../services/custom-toasty.service';

import { Report } from '../../models/report';
import { Associate } from '../../models/associate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DataService, CustomToastyService]
})

export class HomeComponent implements OnInit {

  public report: Report;

  public colorCodeArray = [
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#e67e22',
    '#7f8c8d',
    '#2ecc71',
    '#c0392b',
    '#fab1a0',
    '#a29bfe'
  ];

  private contextualAssociateId: number;

  public associateSkillDetails: Associate[];

  qs_name: string;
  qs_id: string;
  qs_email: string;
  qs_mobile: string;
  qs_skill: string;

  constructor(
    private _dataService: DataService,
    private _customToastyService: CustomToastyService) {

    this.report = this.getEmptyReport();
    this.associateSkillDetails = [];
  }

  ngOnInit() {
    //// Load Report Data
    this._dataService
      .getSingle<Report>('Associates/Skills/Report')
      .subscribe(
        (data: Report) => this.report = data,
        error => () => {
          this.report = this.getEmptyReport();
        });

    //// Load Associate Data
    this._dataService
      .getAll<Associate[]>('Associates/Skills')
      .subscribe(
        (data: Associate[]) => {
          
          this.associateSkillDetails = this.parseAssociateData(data);
        },
        error => () => {
          this.associateSkillDetails = [];
        });
  }

  getEmptyReport() {
    return {
      skillSpread: [],
      registeredCandidate: 0,
      femaleCandidatePercentage: 0,
      maleCandidatePercentage: 0,
      fresherCandidatePercentage: 0,
      ratedCandidate: 0,
      femaleRatedCandidatePercentage: 0,
      maleRatedCandidatePercentage: 0,
      l1CandidatePercentage: 0,
      l2CandidatePercentage: 0,
      l3CandidatePercentage: 0
    };
  }

  openDeleteConfirmModal(associateId) {
    this.contextualAssociateId = associateId;
  }

  deleteSelectedAssociateDetails() {

    this._dataService
      .delete<Associate>('Associates', this.contextualAssociateId).subscribe(
        (data: any) => {
          if (data && data > 0) {
            this._customToastyService.showMessage('success', 'Associate Details Removed Successfully !');

            //// Load Associate Data
            this._dataService
              .getAll<Associate[]>('Associates/Skills')
              .subscribe(
                (data: Associate[]) => {
                  
                  this.associateSkillDetails = this.parseAssociateData(data);

                  //// Load Report Data
                  this._dataService
                    .getSingle<Report>('Associates/Skills/Report')
                    .subscribe(
                      (data: Report) => this.report = data,
                      error => () => {
                        this.report = this.getEmptyReport();
                      });
                },
                error => () => {
                  this.associateSkillDetails = [];
                });
          }
          else {
            this._customToastyService.showMessage('error', 'Failed to Remove Associate Details !');
          }
        },
        error => {
          this._customToastyService.showMessage('error', 'Failed to Remove Associate Details !');
        }
      );
  }

  resetFilter() {
    this.qs_name = '';
    this.qs_id = '';
    this.qs_email = '';
    this.qs_mobile = '';
    this.qs_skill = '';
  }

  parseAssociateData(inputData: Associate[]) {

    inputData.forEach(function (item, index, object) {

      if (!item.pictureBase64String || item.pictureBase64String === '') {
        item.pictureBase64String = 'assets/images/default_prof_pic.jpg';
      }
    });

    return inputData;
  }

}
