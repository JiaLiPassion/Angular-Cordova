# Angular-Cordova
Hybrid App using Angular and Cordova
Test ios

- cd Angular-Cordova
- npx cordova platform add ios
- npx cordova run ios
- click `Create Db1` button
- click `Save String` button in `db1` section
- click `Get Cached String` in `db1` section, should show `test` string.
- click `choose file` in `db1` section, select an image file.
- click `Get cached Blob` button in `db1` section, should show the image.
- repeat the tests in the `db2` section
- click `Drop DB1` button in the `db1` section
- click `Create DB1` button again in the `db1` section
- click `Get Cached string` in `db1` section, should show nothing. And the `db2` section should still display the `test` and the image.

