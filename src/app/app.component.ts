import {registerLocaleData} from '@angular/common';
import { Component } from '@angular/core';
import {Utility} from './core/constants/utility';
import {CampagneService} from './core/services/campagne.service';
import {ConfigService} from './core/services/config.service';
import {Campagne} from './data/schemas/campagne';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PlacementSaigneurWeb';
  constructor(private campagneService: CampagneService, private configService: ConfigService) {
   this.configService.initApp();

    this.campagneService.getCurrentCampagne().subscribe({
      next : value => {
        Utility.CURRENTCAMPAGNE = value as any as Campagne;
      }
    })
  }
}
