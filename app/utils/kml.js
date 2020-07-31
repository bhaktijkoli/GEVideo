import xml2js from 'react-native-xml2js'

module.exports.addPlacemark = (name, lat, lng, alt) => {
    return {
        "name": [
            name
        ],
        "LookAt": [
            {
                "longitude": [
                    lat
                ],
                "latitude": [
                    lng
                ],
                "altitude": [
                    alt
                ],
                "heading": [
                    "0"
                ],
                "tilt": [
                    "0"
                ],
                "gx:fovy": [
                    "35"
                ],
                "range": [
                    "688.6606198508525"
                ],
                "altitudeMode": [
                    "absolute"
                ]
            }
        ],
        "styleUrl": [
            "#__managed_style_000D67EA6614D28DD6DD"
        ],
        "Point": [
            {
                "coordinates": [
                    "72.98006278801404,19.18790447525001,6.907414573957936"
                ]
            }
        ]
    }
}

module.exports.kmlDocument = () => {
    let kml = {
        "kml": {
            "$": {
                "xmlns": "http://www.opengis.net/kml/2.2",
                "xmlns:gx": "http://www.google.com/kml/ext/2.2",
                "xmlns:kml": "http://www.opengis.net/kml/2.2",
                "xmlns:atom": "http://www.w3.org/2005/Atom"
            },
            "Document": [
                {
                    "name": [
                        "Test"
                    ],
                    "Placemark": [
                    ],
                }
            ],
        }
    }
    let builder = new xml2js.Builder();
    return builder.buildObject(kml);
}