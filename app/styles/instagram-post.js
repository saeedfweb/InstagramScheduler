import {
  StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: -1,
    marginRight: -1,
  },
    containerProfile: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50
    },
      containerProfileImage: {
        height: 40,
        width: 40,
        marginLeft: 10,
        borderRadius: 99
      },
      profileText: {
        marginLeft: 10,
        color: '#125688',
        fontWeight: '500',
      },
      containerProfileTime: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 10,
      },
        profileTime: {
          color: '#125688',
          fontWeight: '500',
        },
    containerImage: {
      height: 306,
      flex: 1,
    },
      thumbnail: {
        height: 306,
        borderRadius: 0
      },
    containerDetails: {
      height: 50,
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
    },
      containerPublish: {
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#2d6599',
        flexDirection: 'row',
        alignItems: 'center',
      },
        detailsPublish: {
          color: '#fff',
          fontWeight: '500',
        },
      containerDetailsMore: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 50,
      },
        containerDetailsMoreTouchable: {
          height: 50,
          alignItems: 'center',
          flexDirection: 'row',
        },
          detailsMore: {
            height: 8,
            width: 35,
            marginRight: 10,
            marginLeft: 10,
          },
});
