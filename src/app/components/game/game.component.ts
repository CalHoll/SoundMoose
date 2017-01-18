import { Component, Inject, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppStore } from './../../models/appstore.model';

import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'game',
  styleUrls: ['./game.component.css'],
  templateUrl: './game.component.html'
})

export class GameComponent implements OnInit {

  start: number = 0;
  end: number = 0;
  audio;
  absoluteGameUrl: string;
  relativeGameUrl: string;
  userId: string;
  @Input() audioSrc: string;
  @Input() platform: string;
  @Input() trackId: string;


  constructor(@Inject(DOCUMENT) private document: any, private store: Store<AppStore>) {
    this.store.select(s => s.soundmooseUser)
      .subscribe(userInfo => this.userId = userInfo.userId);
  }

  ngOnInit() {
    this.audio = new Audio(this.audioSrc);
  }

  handleClick() {
    this.audio.currentTime = this.start;
    this.audio.play();
    setTimeout(() => this.audio.pause(), (this.end - this.start) * 1000);
    this.relativeGameUrl = `/game/${this.platform}/${this.trackId}/${this.start}/${this.end}/${this.userId}`;
    this.absoluteGameUrl = this.document.location.origin + this.relativeGameUrl;
    console.log(this.relativeGameUrl);
    console.log(this.absoluteGameUrl);
  }

  // /game/:platform/:trackId/:start/:end/:hostId
}
