import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FloatLabelType } from "@angular/material/form-field";
import { UserService, ChannelService } from "@sunbird/core";
import { IUserData, ToasterService, ResourceService } from "@sunbird/shared";
import { ProfileService } from "@sunbird/profile";
import { ContentSearchService } from "@sunbird/content-search";
import _ from "lodash";
import { FrameworkService } from "../../../../modules/core/services/framework/framework.service";
import { ActivatedRoute } from "@angular/router";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
// import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-professional-details",
  templateUrl: "./professional-details.component.html",
  styleUrls: ["./professional-details.component.scss"],
})
export class ProfessionalDetailsComponent implements OnInit {
  form: FormGroup;
  formData: any = {
    colOne: {
      fields: [
        { label: "Type of Organisation", value: "organisationType" },
        { label: "Organisation Name", value: "organisationName" },
        { label: "Industry", value: "industry" },
        // { label: "Designation", value: "designation" },
        { label: "Location", value: "location" },
        // { label: "Description", value: "description" },
      ],
    },
    colTwo: {
      fields: [
        {
          label: "Organisation Name (Govt. employees)",
          value: "govOrganisationName",
        },
        { label: "Service (Govt. employees)", value: "service" },
      ],
    },
    colThree: {
      fields: [
        { label: "Cadre", value: "cadre" },
        { label: "Allotment Year of Service", value: "allotmentYear" },
        // { label: "Date of Joining", value: "dateOfJoining" },
        { label: "Civil List Number", value: "civilListNumber" },
        { label: "Employee Code", value: "employeeCode" },
        // { label: "Postal Address", value: "postalAddress" },
        // { label: "Pin Code", value: "pinCode" },
      ],
    },
  };
  userProfile: any;
  payload: any = {};
  frameworkId: any;
  positions: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild("areaInput") areaInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    private profileService: ProfileService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    private contentSearchService: ContentSearchService,
    private frameworkService: FrameworkService,
    private channelService: ChannelService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService.userData$.subscribe((user: IUserData) => {
      if (user.userProfile) {
        this.userProfile = user.userProfile;
      }
    });

    if (this.activatedRoute.snapshot.queryParams.showError != undefined) {
      this.toasterService.warning("Please update your designation to proceed.");
    }

    this.channelService
      .getFrameWork(this.activatedRoute.snapshot.queryParams.channel)
      .subscribe((res: any) => {
        this.frameworkId = res.result.channel.frameworks[0].identifier;
        this.frameworkService
          .getSelectedFrameworkCategories(this.frameworkId)
          .subscribe((categories: any) => {
            categories.result.framework.categories.map((item: any) => {
              if (item.identifier == "fracing_fw_taxonomycategory1") {
                this.positions = [...item.terms];
              }
            });
          });
      });

    this.formData.colOne.fields.map((item) => {
      item.label = this.resourceService.frmelmnts.lbl.editProfile[item.value];
    });

    if (this.formData.colTwo && this.formData.colTwo.fields) {
      this.formData.colTwo.fields.map((item) => {
        item.label = this.resourceService.frmelmnts.lbl.editProfile[item.value];
      });
    }

    if (this.formData.colThree && this.formData.colThree.fields) {
      this.formData.colThree.fields.map((item) => {
        item.label = this.resourceService.frmelmnts.lbl.editProfile[item.value];
      });
    }

    this.form = this.formBuilder.group({
      // First Column
      organisationType: [
        this.userProfile?.profileDetails?.professionalDetails
          ?.organisationType || "",
      ],
      organisationName: [
        this.userProfile?.profileDetails?.professionalDetails
          ?.organisationName || "",
      ],
      industry: [
        this.userProfile?.profileDetails?.professionalDetails?.industry || "",
      ],
      // designation: [
      //   this.userProfile?.profileDetails?.professionalDetails?.designation ||
      //     "",
      // ],
      location: [
        this.userProfile?.profileDetails?.professionalDetails?.location || "",
      ],
      // description: [
      //   this.userProfile?.profileDetails?.professionalDetails?.description ||
      //     "",
      // ],

      // Second Column
      govOrganisationName: [
        this.userProfile?.profileDetails?.professionalDetails
          ?.govOrganisationName || "",
      ],
      service: [
        this.userProfile?.profileDetails?.professionalDetails?.service || "",
      ],

      // Third Column
      cadre: [
        this.userProfile?.profileDetails?.professionalDetails?.cadre || "",
      ],
      allotmentYear: [
        this.userProfile?.profileDetails?.professionalDetails?.allotmentYear ||
          "",
      ],
      // dateOfJoining: [
      //   this.userProfile?.profileDetails?.professionalDetails?.dateOfJoining ||
      //     "",
      // ],govOrganisationName
      civilListNumber: [
        this.userProfile?.profileDetails?.professionalDetails
          ?.civilListNumber || "",
      ],
      employeeCode: [
        this.userProfile?.profileDetails?.professionalDetails?.employeeCode ||
          "",
      ],
      // postalAddress: [
      //   this.userProfile?.profileDetails?.professionalDetails?.postalAddress ||
      //     "",
      // ],
      // pinCode: [
      //   this.userProfile?.profileDetails?.professionalDetails?.pinCode || "",
      // ],
    });
  }

  onSubmit(request) {
    if (this.form.valid) {
      this.payload = this.form.value;

      this.userService.userData$.subscribe((user: any) => {
        if (user && user.userProfile) {
          this.userProfile = user.userProfile;

          let professionalDetails: any = {
            organisationType: this.payload.organisationType,
            organisationName: this.payload.organisationName,
            industry: this.payload.industry,
            // designation: this.payload.designation,
            location: this.payload.location,
            // description: this.payload.description,
            govOrganisationName: this.payload.govOrganisationName,
            service: this.payload.service,
            cadre: this.payload.cadre,
            allotmentYear: this.payload.allotmentYear,
            // dateOfJoining: this.payload.dateOfJoining,
            civilListNumber: this.payload.civilListNumber,
            employeeCode: this.payload.employeeCode,
            // postalAddress: this.payload.postalAddress,
            // pinCode: this.payload.pinCode,
          };

          this.userProfile.profileDetails = {
            ...this.userProfile.profileDetails,
            professionalDetails: {
              ...this.userProfile.profileDetails.professionalDetails,
              ...professionalDetails,
            },
          };

          const payloadWithProfileDetails = {
            profileDetails: this.userProfile.profileDetails,
          };
          console.log("PAYLOAD",payloadWithProfileDetails)

          this.profileService
            .updatePrivateProfile(payloadWithProfileDetails)
            .subscribe((res) => {
              this.toasterService.success(
                _.get(this.resourceService, "messages.smsg.m0059")
              );
            });
        }
      });
    }
  }
}
