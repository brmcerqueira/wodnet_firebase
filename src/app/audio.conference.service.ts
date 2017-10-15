import {environment} from '../environments/environment';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Injectable} from '@angular/core';

@Injectable()
export class AudioConferenceService {

  private yourId: number;
  private daoConnections: AngularFireList<any>;

  constructor(private database: AngularFireDatabase) {
    this.yourId = Math.floor(Math.random() * 1000000000);
  }

  private sendMessage(data: any): void {
    this.daoConnections.push({ sender: this.yourId, message: JSON.stringify(data) });
  }

  public createOffer(): void {
    const pc = new RTCPeerConnection({ iceServers: environment.iceServers });

    this.daoConnections = this.database.list('connections');

    pc.onicecandidate = event => {
      if (event.candidate) {
        this.sendMessage({ ice: event.candidate });
      }
      else {
        console.log('Sent All Ice');
      }
    };

    pc['ontrack'] = event => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(event.streams[0]);
      audio.load();
      audio.play();
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => pc.addStream(stream))

    this.daoConnections.stateChanges(['child_added']).subscribe(data => {
      const msg = JSON.parse(data.payload.val().message);
      const sender = data.payload.val().sender;
      if (sender !== this.yourId) {
        if (msg.ice) {
          pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp.type === 'offer') {
          pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            .then(() => pc.createAnswer())
            .then(answer => pc.setLocalDescription(answer))
            .then(() => this.sendMessage({ sdp: pc.localDescription })).catch(e => console.log(e));
        } else if (msg.sdp.type === 'answer') {
          pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
      }
    });

    pc.createOffer().then(offer => pc.setLocalDescription(offer))
      .then(() => this.sendMessage({ sdp: pc.localDescription })).catch(e => console.log(e));
  }
}
