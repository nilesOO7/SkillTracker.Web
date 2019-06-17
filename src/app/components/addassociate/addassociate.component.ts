import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { DataService } from '../../services/data.service';
import { CustomToastyService } from '../../services/custom-toasty.service';

import { Associate } from '../../models/associate';
import { SkillMapForAssociate } from '../../models/skillMapForAssociate';
import { Skill } from '../../models/skill';
import { AssociateSkill } from '../../models/associateSkill';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ViewChild, ElementRef } from '@angular/core';
import { Image } from '../../models/image';
import { IfObservable } from 'rxjs/observable/IfObservable';

@Component({
  selector: 'app-addassociate',
  templateUrl: './addassociate.component.html',
  styleUrls: ['./addassociate.component.css'],
  providers: [DataService, CustomToastyService]
})

export class AddassociateComponent implements OnInit, OnDestroy {

  private sub: any;
  private contextualAssociateId: number;
  private associateModelforEdit: Associate;
  public isEditMode: boolean;
  public isViewMode: boolean;

  qs_SkillSearch: string;
  qs_SkillSearchMaster: string;

  public associateToAdd: Associate;

  public skillsToAdd: SkillMapForAssociate[];
  private initSkills: SkillMapForAssociate[];

  public skillsMaster: Skill[];
  private skillBeforeUpdate: Skill;
  private newSkill: string;

  public isSkillEditInProgress: boolean;

  @ViewChild("fileInput") fileInput: ElementRef;

  constructor(
    private _location: Location,
    private _dataService: DataService,
    private _customToastyService: CustomToastyService,
    private route: ActivatedRoute,
    private router: Router) {

    this.associateToAdd = this.getEmptyModel();

    this.skillsToAdd = [];
    this.initSkills = [];

    this.skillsMaster = [];
  }

  ngOnInit() {

    if (this.router.url.includes('edit')) {
      this.isEditMode = true;
    }
    else {
      this.isEditMode = false;
    }

    if (this.router.url.includes('view')) {
      this.isViewMode = true;
    }
    else {
      this.isViewMode = false;
    }

    if (this.isEditMode || this.isViewMode) {

      this.sub = this.route.params.subscribe(params => {

        if (params['id'] && Number.isInteger(+params['id'])) {

          //// If Edit/View Mode then Load Associate related Data after Loading Skill Master Data
          this.contextualAssociateId = + params['id'];

          this._dataService
            .getAll<SkillMapForAssociate[]>('Associates/' + this.contextualAssociateId + '/Skills')
            .subscribe(
              (data: SkillMapForAssociate[]) => {

                this.skillsToAdd = data;
                this.initSkills = JSON.parse(JSON.stringify(data));

                this._dataService
                  .getSingleById<Associate>('Associates', this.contextualAssociateId)
                  .subscribe((data: Associate) => {

                    if (!data.pictureBase64String) {
                      data.pictureBase64String = 'assets/images/default_prof_pic.jpg';
                    }

                    this.associateToAdd = data;
                    this.associateToAdd.idTxt = data.id + '';
                    this.associateToAdd.levelTxt = data.level + '';

                    this.associateModelforEdit = Object.assign({}, data);
                  },
                    error => () => {
                    }
                  );
              },
              error => () => {
                this.skillsToAdd = [];
                this.initSkills = [];
              });
        }
        else {
          this.contextualAssociateId = 0;
        }
      });
    }
    else {
      this._dataService
        .getAll<SkillMapForAssociate[]>('Associates/0/Skills')
        .subscribe(
          (data: SkillMapForAssociate[]) => {
            this.skillsToAdd = data;
            this.initSkills = JSON.parse(JSON.stringify(data));
          },
          error => () => {
            this.skillsToAdd = [];
            this.initSkills = [];
          });
    }
  }

  ngOnDestroy() {
    if (this.isEditMode || this.isViewMode) { this.sub.unsubscribe(); }
  }

  cancelClick() {
    this._location.back();
  }

  resetClick() {
    if (this.isEditMode) {
      this.associateToAdd = Object.assign({}, this.associateModelforEdit);
    }
    else {
      this.associateToAdd = this.getEmptyModel();
    }

    this.skillsToAdd = JSON.parse(JSON.stringify(this.initSkills));
  }

  getEmptyModel() {
    return {
      id: 0,
      idTxt: '',
      name: '',
      email: '',
      mobile: '',
      picture: '',
      pictureBase64String: 'assets/images/default_prof_pic.jpg',
      status: 'Green',
      level: 1,
      levelTxt: '1',
      remark: '',
      strength: '',
      weakness: '',
      gender: 'F',
      isFresher: false,
      otherSkill: '',
      strongSkills: ''
    };
  }

  getSkillSubset(isSelected: boolean) {
    return this.skillsToAdd.filter((skill) => isSelected ? skill.rating > 0 : skill.rating == 0);
  }

  resetSkillSelectionFilter() {
    this.qs_SkillSearch = '';
  }

  skillMasterOpen() {
    this._dataService
      .getAll<Skill[]>('Skills')
      .subscribe(
        (data: Skill[]) => {
          this.skillsMaster = data;
        },
        error => () => {
          this.skillsMaster = [];
        });
  }

  skillEditEnable(skill) {
    skill.isForEdit = true;
    this.skillBeforeUpdate = JSON.parse(JSON.stringify(skill));

    this.skillsMaster.forEach(function (item, index, object) {
      if (item.id != skill.id) {
        item.actionDisabled = true;
      }
    });

    this.isSkillEditInProgress = true;
  }

  skillEditDisable(skill) {
    skill.isForEdit = false;
    skill.name = this.skillBeforeUpdate.name;

    this.skillsMaster.forEach(function (item, index, object) {
      item.actionDisabled = false;
    });

    this.isSkillEditInProgress = false;
  }

  resetSkillMasterFilter() {
    this.qs_SkillSearchMaster = '';
  }

  addNewSkillToMaster() {

    if (this.newSkill && this.newSkill.trim() !== '') {

      let newInputSkill = {
        id: 0,
        name: this.newSkill.trim(),
        isTechnical: false,
        isForEdit: false,
        actionDisabled: false
      };

      this._dataService
        .add<Skill>('Skills', newInputSkill)
        .subscribe(
          (data: any) => {
            if (data && data > 0) {
              this._customToastyService.showMessage('success', 'New Skill Added Successfully !');

              this._dataService
                .getAll<Skill[]>('Skills')
                .subscribe(
                  (data: Skill[]) => {
                    this.skillsMaster = data;
                  },
                  error => () => {
                    this.skillsMaster = [];
                  });

              this.skillsToAdd.push({
                skillId: data,
                name: this.newSkill.trim(),
                isTechnical: false,
                rating: 0,
                isSelected: false
              });
              this.initSkills.push({
                skillId: data,
                name: this.newSkill.trim(),
                isTechnical: false,
                rating: 0,
                isSelected: false
              });

              this.newSkill = '';
            }
            else {
              this._customToastyService.showMessage('error', 'Failed to Add New Skill !');
            }
          },
          error => {
            this._customToastyService.showMessage('error', 'Failed to Add New Skill !');
          }
        );
    }
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

  deleteSkillFromMaster(skillId: number) {

    this._dataService
      .delete<Skill>('Skills', skillId).subscribe(
        (data: any) => {
          if (data && data > 0) {
            this._customToastyService.showMessage('success', 'Skill Removed Successfully !');

            this._dataService
              .getAll<Skill[]>('Skills')
              .subscribe(
                (data: Skill[]) => {
                  this.skillsMaster = data;
                },
                error => () => {
                  this.skillsMaster = [];
                });

            this.skillsToAdd.splice(
              this.skillsToAdd.findIndex(function (i) {
                return i.skillId == skillId;
              }), 1);
            this.initSkills.splice(
              this.initSkills.findIndex(function (i) {
                return i.skillId == skillId;
              }), 1);
          }
          else {
            this._customToastyService.showMessage('error', 'Failed to Remove Selected Skill !');
          }
        },
        error => {
          this._customToastyService.showMessage('error', 'Failed to Remove Selected Skill !');
        }
      );
  }

  updateSkillMaster(updatedSkill: Skill) {

    if (updatedSkill.name
      && updatedSkill.name.trim() !== ''
      && updatedSkill.name !== this.skillBeforeUpdate.name) {

      this._dataService
        .update<Skill>('Skills', updatedSkill).subscribe(
          (data: any) => {
            if (data && data > 0) {
              this._customToastyService.showMessage('success', 'Skill Updated Successfully !');

              this._dataService
                .getAll<Skill[]>('Skills')
                .subscribe(
                  (data: Skill[]) => {
                    this.skillsMaster = data;
                  },
                  error => () => {
                    this.skillsMaster = [];
                  });

              this.skillsToAdd.forEach(function (item, index, object) {
                if (item.skillId == updatedSkill.id) {
                  item.name = updatedSkill.name;
                }
              });
              this.initSkills.forEach(function (item, index, object) {
                if (item.skillId == updatedSkill.id) {
                  item.name = updatedSkill.name;
                }
              });

              this.skillEditDisable(updatedSkill);
            }
            else {
              this._customToastyService.showMessage('error', 'Failed to Update Selected Skill !');
            }
          },
          error => {
            this._customToastyService.showMessage('error', 'Failed to Update Selected Skill !');
          }
        );
    }
  }

  addNewAssocRecord() {

    if (
      parseInt(this.associateToAdd.idTxt)
      && parseInt(this.associateToAdd.idTxt) > 0
      && this.associateToAdd.idTxt == (parseInt(this.associateToAdd.idTxt) + '')) {
      this.associateToAdd.id = parseInt(this.associateToAdd.idTxt);
    }
    else {
      this.associateToAdd.id = 0;
    }

    this.associateToAdd.level = parseInt(this.associateToAdd.levelTxt);

    if (
      this.associateToAdd.id > 0
      && this.associateToAdd.name && this.associateToAdd.name.trim() !== ''
      && this.associateToAdd.email && this.associateToAdd.email.trim() !== '' && this.validateEmail(this.associateToAdd.email.trim())
      && this.associateToAdd.mobile && (this.associateToAdd.mobile + '').trim() !== ''
      && this.associateToAdd.remark && this.associateToAdd.remark.trim() !== ''
    ) {

      this._dataService
        .getSingleById<Associate>('Associates', this.associateToAdd.id)
        .subscribe(
          (data: Associate) => {

            if (data && data != null) {
              this._customToastyService.showMessage('warning', 'Associate - "' + data.name.trim() + '" with Id "' + data.id + '" Already Exists !');
            }
            else {
              this._dataService
                .add<Associate>('Associates', this.associateToAdd)
                .subscribe(
                  (data: any) => {
                    if (data && data > 0) {
                      //// Map selected Skills
                      var associateAdded = this.associateToAdd.id;
                      var skillsToBeMapped = [];

                      this.skillsToAdd.forEach(function (item, index, object) {
                        if (item.rating > 0) {
                          skillsToBeMapped.push({
                            associateId: associateAdded,
                            skillId: item.skillId,
                            rating: item.rating,
                            skillName: '',
                            percentage: 0
                          });
                        }
                      });

                      this._dataService
                        .update<AssociateSkill[]>('Associates/' + associateAdded + '/Skills', skillsToBeMapped).subscribe(
                          (data: any) => {
                            if (data && data == true) {

                              this._customToastyService.showMessage('success', 'New Associate Details Added Successfully !');

                              this.associateToAdd = this.getEmptyModel();
                              this.skillsToAdd = JSON.parse(JSON.stringify(this.initSkills));
                            }
                            else {
                              this._customToastyService.showMessage('error', 'Associate Details Added But Failed to Map Selected Skill !');
                            }
                          },
                          error => {
                            this._customToastyService.showMessage('error', 'Associate Details Added But Failed to Map Selected Skill !');
                          }
                        );
                    }
                    else {
                      this._customToastyService.showMessage('error', 'Failed to Add Associate Details !');
                    }
                  },
                  error => {
                    this._customToastyService.showMessage('error', 'Failed to Add Associate Details !');
                  }
                );
            }
          },
          error => () => {
            this._customToastyService.showMessage('error', 'Failed to Add Associate Details !');
          });
    }
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

  updateAssocRecord() {

    if (
      parseInt(this.associateToAdd.idTxt)
      && parseInt(this.associateToAdd.idTxt) > 0
      && this.associateToAdd.idTxt == (parseInt(this.associateToAdd.idTxt) + '')) {
      this.associateToAdd.id = parseInt(this.associateToAdd.idTxt);
    }
    else {
      this.associateToAdd.id = 0;
    }

    this.associateToAdd.level = parseInt(this.associateToAdd.levelTxt);

    if (
      this.associateToAdd.id > 0
      && this.associateToAdd.name && this.associateToAdd.name.trim() !== ''
      && this.associateToAdd.email && this.associateToAdd.email.trim() !== '' && this.validateEmail(this.associateToAdd.email.trim())
      && this.associateToAdd.mobile && (this.associateToAdd.mobile + '').trim() !== ''
      && this.associateToAdd.remark && this.associateToAdd.remark.trim() !== ''
    ) {
      //// Check if no changes were made
      var initSkills_rated = this.initSkills.filter((skill) => skill.rating > 0);
      var skillsToAdd_rated = this.skillsToAdd.filter((skill) => skill.rating > 0);

      // console.log(JSON.stringify(skillsToAdd_rated));
      // console.log(JSON.stringify(JSON.stringify(initSkills_rated)));
      // console.log(JSON.stringify(this.associateModelforEdit) === JSON.stringify(this.associateToAdd));
      // console.log(JSON.stringify(skillsToAdd_rated) === JSON.stringify(initSkills_rated));

      if (JSON.stringify(this.associateModelforEdit) === JSON.stringify(this.associateToAdd)
        && JSON.stringify(skillsToAdd_rated) === JSON.stringify(initSkills_rated)) {
        this._customToastyService.showMessage('warning', 'No Changes in Associate/Skill Details to Update !');
      }
      else {

        var isAssocEdited = false;
        var isSkillEdited = false;

        if (JSON.stringify(this.associateModelforEdit) !== JSON.stringify(this.associateToAdd)) {
          isAssocEdited = true;
        }
        if (JSON.stringify(skillsToAdd_rated) !== JSON.stringify(initSkills_rated)) {
          isSkillEdited = true;
        }

        if (isAssocEdited) {

          this._dataService
            .update<Associate>('Associates', this.associateToAdd).subscribe(
              (data: any) => {
                if (data && data > 0) {

                  if (isSkillEdited) {

                    var associateModified = this.associateToAdd.id;
                    var skillsToBeMapped = [];

                    this.skillsToAdd.forEach(function (item, index, object) {
                      if (item.rating > 0) {
                        skillsToBeMapped.push({
                          associateId: associateModified,
                          skillId: item.skillId,
                          rating: item.rating,
                          skillName: '',
                          percentage: 0
                        });
                      }
                    });

                    this._dataService
                      .update<AssociateSkill[]>('Associates/' + associateModified + '/Skills', skillsToBeMapped).subscribe(

                        (data: any) => {

                          if (data && data == true) {
                            this._customToastyService.showMessage('success', 'Associate Details Updated Successfully !');
                            this.cancelClick();
                          }
                          else {
                            this._customToastyService.showMessage('error', 'Associate Details Updated But Failed to Map Modified Skill !');
                          }
                        },
                        error => {
                          this._customToastyService.showMessage('error', 'Associate Details Updated But Failed to Map Modified Skill !');
                        }
                      );
                  }
                  else {
                    this._customToastyService.showMessage('success', 'Associate Details Updated Successfully !');
                    this.cancelClick();
                  }
                }
              },
              error => {
                this._customToastyService.showMessage('error', 'Failed to Update Associate Details !');
              }
            );
        }
        else {

          var associateModified = this.associateToAdd.id;
          var skillsToBeMapped = [];

          this.skillsToAdd.forEach(function (item, index, object) {
            if (item.rating > 0) {
              skillsToBeMapped.push({
                associateId: associateModified,
                skillId: item.skillId,
                rating: item.rating,
                skillName: '',
                percentage: 0
              });
            }
          });

          this._dataService
            .update<AssociateSkill[]>('Associates/' + associateModified + '/Skills', skillsToBeMapped).subscribe(

              (data: any) => {

                if (data && data == true) {

                  this._customToastyService.showMessage('success', 'Associate Details Updated Successfully !');
                  this.cancelClick();
                }
                else {
                  this._customToastyService.showMessage('error', 'Failed to Update Associate Details !');
                }
              },
              error => {
                this._customToastyService.showMessage('error', 'Failed to Update Associate Details !');
              }
            );
        }
      }
    }
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

  deleteClick() {
    this._dataService
      .delete<Associate>('Associates', this.associateToAdd.id).subscribe(
        (data: any) => {
          if (data && data > 0) {
            this._customToastyService.showMessage('success', 'Associate Details Removed Successfully !');
            this.cancelClick();
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

  validateEmail(emailAddr) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailAddr);
  }

  uploadImage() {

    let fi = this.fileInput.nativeElement;

    if (fi.files && fi.files[0]) {

      let fileToUpload = fi.files[0];
      this._dataService
        .upload(fileToUpload)
        .subscribe(res => {

          this.associateToAdd.picture = res.toString();

          var imageToSearch = {
            fileName: res.toString(),
            base64StringSrc: ""
          };

          this._dataService
            .add<Image>('Associates/FetchImage', imageToSearch)
            .subscribe(
              (data: Image) => {

                this.associateToAdd.pictureBase64String = data.base64StringSrc;
                ////console.log(data);
              },
              error => () => {
                this._customToastyService.showMessage('error', 'Failed to Upload Image !');
              });
        });
    }
  }
}
