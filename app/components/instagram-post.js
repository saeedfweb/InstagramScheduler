'use strict';

var FileSystem = require('react-native-fs');
var style = require('../styles/instagram-post');
var Helper = require('../helpers/general');
var Notification = require('../helpers/notification');
var Icon = require('react-native-vector-icons/FontAwesome');

import React, {
  Component,
} from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  NativeModules,
  TimePickerAndroid,
  DatePickerAndroid,
  DeviceEventEmitter,
  ProgressBarAndroid
} from 'react-native';

const DOWNLOAD_FOLDER_PATH = FileSystem.PicturesDirectoryPath + "/instagram-scheduler-app";

class InstagramPost extends Component {
  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      progress: 0,
      downloading: false,
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null
    }
  }

  componentDidMount() {
    if (this.props.publish) {
      this.publishOnInstagram()
    }
  }

  resetTimeState() {
    this.setState({
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null
    })
  }

  publishOnInstagram() {
    var react = this;
    FileSystem.exists(this.getDownloadPath()).then(function(exists) {
      if (exists) {
        react.openInstagramIntent();
      } else {
        react.download();
        react.setState({
          progress: 0,
          downloading: true
        });
      }
    });
  }

  getDownloadPath() {
    return DOWNLOAD_FOLDER_PATH + "/photo-" + this.props.data.id + ".jpg"
  }

  download() {
    var react = this;
    var link = this.props.data.image;

    FileSystem.downloadFile(link, this.getDownloadPath(), function(){}, this.updateProgress.bind(react)).then(() => {
      react.setState({
        progress: 1
      });

      // For an effect
      new Promise(function(resolve, reject) {
        react.setState({
          downloading: false,
          progress: 0
        }, react.openInstagramIntent);
      })
    });
  }

  updateProgress(progress) {
    this.setState({
      progress: (progress.bytesWritten / progress.contentLength)
    })
  }

  openInstagramIntent() {
    var react = this;
    FileSystem.exists(this.getDownloadPath()).then((exists) => {
      if (exists) {
        NativeModules.InstagramPublish.share(react.getDownloadPath());
      }
    });
  }

  async showDatePicker() {
    try {
      var options = {
        date: new Date(),
        minDate: new Date()
      };
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dateSetAction) {
        this.showTimePicker();

        var date = new Date(year, month, day);
        this.setState({
          year: year,
          month: month,
          day: day
        });
      } else {
        this.resetTimeState()
      }
    } catch ({code, message}) {
      console.warn(`Error in example: `, message);
    }
  }

  async showTimePicker() {
    var options = {
      is24Hour: true
    };

    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        Notification.create(this.state.year, this.state.month, this.state.day, hour, minute, this.props.data);

        this.setState({
          hour: hour,
          minute: minute
        });
      } else if (action === TimePickerAndroid.dismissedAction) {
        this.resetTimeState()
      }
    } catch ({code, message}) {
      console.warn(`Error in example: `, message);
    }
  }

  render() {
    return(
      <View style={style.container}>
        <View style={style.containerProfile}>
          <Image source={{uri: this.props.data.profile_picture}} style={style.containerProfileImage} />
          <Text style={style.profileText}>{this.props.data.username}</Text>
          <View style={style.containerProfileTime}>
            <Text style={style.profileTime}>
              { this.renderBellIcon() }
              {" "}
              {Helper.getPublishDate(this.state.year, this.state.month, this.state.day, this.state.hour, this.state.minute)}
            </Text>
          </View>
        </View>
        <View style={style.containerImage}>
          <Image
            source={{uri: this.props.data.image}}
            style={style.thumbnail}
          />
        </View>
        { this.renderFooter() }
        { this.renderProgressBar() }
      </View>
    );
  }

  renderBellIcon() {
    if (this.state.minute) {
      return(
        <Icon name="bell" />
      );
    }
  }

  renderProgressBar() {
    if (this.state.downloading) {
      return(
        <ProgressBarAndroid
          progress={this.state.progress}
          indeterminate={false}
          styleAttr="Horizontal"
          color="darkslateblue" />
      );
    }
    return;
  }

  renderFooter() {
    if(this.props.publish == true)
    {
      return(
        this.state.downloading ?
          <Icon.Button name="instagram" style={style.containerPublishDisabled}>
            <Text style={style.detailsPublish}>Publish</Text>
          </Icon.Button>
        : <Icon.Button name="instagram" style={style.containerPublish} onPress={this.publishOnInstagram.bind(this)}>
            <Text style={style.detailsPublish}>Publish</Text>
          </Icon.Button>
      );
    }
    else
    {
      return(
        <View style={style.containerDetails}>
          <Icon.Button name="instagram" style={style.containerPublish} onPress={this.publishOnInstagram.bind(this)}>
            <Text style={style.detailsPublish}>Publish</Text>
          </Icon.Button>

          <View style={style.containerDetailsMore}>
            <TouchableNativeFeedback onPress={this.showDatePicker.bind(this)}>
              <View style={style.containerDetailsMoreTouchable}>
                <Icon name="clock-o" size={25} style={style.detailsMore} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      );
    }
  }
}
InstagramPost.defaultProps = {
  publish: false
};

module.exports = InstagramPost;
