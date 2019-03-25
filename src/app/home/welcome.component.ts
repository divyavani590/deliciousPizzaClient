import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlexaVoiceService } from '../services/welcome.service';
import { CrustService } from '../services/crust.service';
import { MeatService } from '../services/meat.service';
import { VeggieService } from '../services/veggie.service';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy{

  constructor(private alexaService:AlexaVoiceService, private crustService: CrustService, private meatService: MeatService, private veggieService: VeggieService){

  }
  pageTitle = 'Create Your Dream Pizza !!!';
  currentStep = 'step1';
  cheeseImg = "./assets/images/topping/cheese_mozz_ML.png";
  pizzaImg = "./assets/images/crust/crust_pan_NoFinish.png";
  meatTops = [];
  veggieTops = [];
  showMeatsReview=false;
  showVeggiesReview=false;
  responseObj;
  connection;
  message;
  crustTypes;
  errorMessage;
  meatTypes;
  veggieTypes;

  selectPizza(crust){
    this.crustTypes.forEach((item) => {
      item.selected = false;
    });
    crust.selected = true;
    this.pizzaImg = crust.crustFullImg;
  }

  selectMeatTops(meat){
    meat.selected = true;
    this.meatTops.push(meat);
  }

  selectVeggieTops(veggie){
    veggie.selected = true;
    this.veggieTops.push(veggie);
  }

  createReview(){
    this.meatTypes.forEach((item) => {
      if(item.selected == true)
      this.showMeatsReview = true;
    });
    this.veggieTypes.forEach((item) => {
      if(item.selected == true)
      this.showVeggiesReview = true;
    });   
  }

  ngOnInit() {
    this.connection = this.alexaService.getMessages().subscribe((message) => {
      this.responseObj = message;
      this.updatePage();
    });
    this.crustService.getProducts().subscribe(
      crusts => {
        this.crustTypes = crusts;
      },
      error => this.errorMessage = <any>error
    );
    this.meatService.getMeats().subscribe(
      meats => {
        this.meatTypes = meats;
      },
      error => this.errorMessage = <any>error
    );
    this.veggieService.getVeggies().subscribe(
      veggies => {
        this.veggieTypes = veggies;
      },
      error => this.errorMessage = <any>error
    );
  }

  updatePage(){
    if(this.responseObj.intent == "SelectCrustIntent"){
      this.crustTypes.forEach((item) => {
        if(item.id == this.responseObj.message){
          item.selected = true;
          this.pizzaImg = item.crustFullImg;
        }        
      });     
    }
    if(this.responseObj.intent == "FlowIntent"){
      this.currentStep = 'step'+ (parseInt(this.responseObj.message)+1)  
    }
    if(this.responseObj.intent == "SelectMeatsIntent"){
      this.meatTypes.forEach((item) => {
        if(item.id == this.responseObj.message){
          item.selected = true;
          this.meatTops.push(item);
        }        
      });     
    }
    if(this.responseObj.intent == "SelectVeggiesIntent"){
      this.veggieTypes.forEach((item) => {
        if(item.id == this.responseObj.message){
          item.selected = true;
          this.veggieTops.push(item);
        }        
      });     
    }
  }
  
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
