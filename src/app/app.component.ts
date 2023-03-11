import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'video-recorder';
  isRecording = false;

  @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;


  constructor(@Inject(PLATFORM_ID) private _platform: Object) {}

  onStart(){
    if(isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices.getUserMedia({video: true}).then((ms: MediaStream) => {
        const _video = this.video.nativeElement;
        _video.srcObject = ms;
        _video.play().then(() => {
          _video.pause();
          _video.play();
        });
        this.isRecording = true;
      });
    }
  }

  onStop() {
    this.isRecording = false;
    this.video.nativeElement.pause();
    (this.video.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    this.video.nativeElement.srcObject = null;
  }

  ngOnDestroy() {
    (this.video.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
  }
}
