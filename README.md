## Documentation
### A. API
#### Endpoint
* **Login**
  * **Endpoint :** `/login`
  * **Method :** `POST`
  * **Body :** </br>
    `email` as `string`</br>
    `password` as `string`
  * **response :** </br>
    * **status code :** 200 </br>
      **body :**
      ```
      {
          "status": "success",
          "message": "Login berhasil",
          "user": {
          "idToken":
            "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiYmQyOTllODU2MmU3MmYyZThkN2YwMTliYTdiZjAxMWFlZjU1Y2EiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoieXVudGFmYSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9hdmlkLWxvY2stNDA1ODE2IiwiYXVkIjoiYXZpZC1sb2NrLTQwNTgxNiIsImF1dGhfdGltZSI6MTcwMTQzNjc3OCwidXNlcl9pZCI6IkJUS2FQVWpwaU5UblVkb2hab3hhN1NONnk2cTEiLCJzdWIiOiJCVEthUFVqcGlOVG5VZG9oWm94YTdTTjZ5NnExIiwiaWF0IjoxNzAxNDM2Nzc4LCJleHAiOjE3MDE0NDAzNzgsImVtYWlsIjoiY29udG9oZW1haWxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImNvbnRvaGVtYWlsQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.F5HpNXwjzNeHSErVK3ejkB2ZRRYNm_ckt9AFbK_q3GpUX9Wi0ChajSVTdxEhT6aUmLWypFyyzbrFRhz1hSShYB9b9GbbHG7QKiiaNPlcll4qaPoy7kqgy7tbxujleSj9QbV9inqKIoISuWPlEwWLkbVrviO-u1_OCoOFGNkQ6rvdM3LAp2jJ7fCUPxhDSu9RiVNCEYVj_trH8ZmQTL6XLrI8zs4WTyqtx57WT0uFoTN7p7bLxv4Z4WLhpobuq9zzfQ8MtEZ4FWZjbFOEklZezS7SLe2515r9bgkRpvSn4iY0ED_qGqahxq4rcnfZzch4WqJcvuSXX7THdt1T-2Utfg",
          "localId": "BTKaPUjpiNTnUdohZoxa7SN6y6q1",
          "email": "contohemail@gmail.com",
          "displayName": "yuntafa"
         }
      }
      ```
* **Register**
  * **Endpoint :** `/register`
  * **Method :** `POST`
  * **Body :** </br>
    `email` as `string`</br>
    `password` as `string`</br>
    `displayname` as `string`
  * **response :** </br>
    * **status code :** 200 </br>
      **body :**
      ```
      {
          "status": "success",
          "message": "Pengguna berhasil didaftarkan dan informasi pengguna ditambahkan ke Firestore"
      }
      ```

* **Retrieves a Egg Data By its Phase**
    * **Endpoint :** `get-eggs-by-phase`
    * **Method :** `GET`
    * **Body :** </br>
    `detectionTimestamp` as `timestamp`</br>
    `fertilization` as `boolean`</br>
    `phase` as `string`</br>
    `pixels` as `array`</br>
    `userId` as `string`
    * **response :** </br>
      * **status code :** 200 </br>
        **body :**
        ```
         {
              "document_id": "mF0mQLsiml7sV7RUCR6Y",
              "detectionTimestamp": {
                  "_seconds": 1700730000,
                  "_nanoseconds": 0
              },
              "fertilization": "Fertil",
              "pixels": [
                  "[400,230,65]",
                  "[321,55,45]"
              ],
              "phase": "Embrio",
              "userId": "CPFDmu1Fi4TwAIFXOQE9zWNeLr22"
          }
        /// dan data yang lainnya
        ```
        
* **Retrieve a Egg Data From a Specific Time Frame**
  * **Endpoint :** `get-eggs-by-date-range-user`
  * **Method :** `GET`
  * **Body :** </br>
    `detectionTimestamp` as `timestamp`</br>
    `fertilization` as `boolean`</br>
    `phase` as `string`</br>
    `userId` as `string`</br>
  * **Params :** </br>
    * Key `startDate` Value `'2023-11-23'` </br>
    * Key `endDate` Value `'2023-12-03'` </br>
    * Key `userId` Value `'CPFDmu1Fi4TwAIFXOQE9zWNeLr22'`
  * **response :** </br>
    * **status code :** 200 </br>
      **body :**
      ```
              {
                "detectionTimestamp": "2023-11-28T09:00:00.000Z",
                "fertilization": "Fertil",
                "phase": "Tahap Akhir",
                "userId": "CPFDmu1Fi4TwAIFXOQE9zWNeLr22"
            }
      /// dan data telur lainnya
      ```
  Only one specific date based on userId
  * **Params :** </br>
    * Key `userId` Value `'CPFDmu1Fi4TwAIFXOQE9zWNeLr22'` </br>
    * Key `date` Value `'2023-12-01'`
  * **response :** </br>
    * **status code :** 200 </br>
      **body :**
      ```
      {
            "detectionTimestamp": "2023-12-01T09:00:00.000Z",
            "fertilization": "Fertil",
            "phase": "Embrio",
            "userId": "CPFDmu1Fi4TwAIFXOQE9zWNeLr22"
      }
      ```

* **Add Data Egg Based On UID**
  * **Endpoint :** `add-egg-detected`
  * **Method :** `POST`
  * **Body :** </br>
    `detectionTimestamp` as `timestamp`</br>
    `label` as `string`</br>
    `images` as `file`</br>
    `userId` as `string`
  * **response :** </br>
    * **status code :** 200 </br>
      **body :**
      ```
      {
        "status": "success",
        "message": "Data telur baru berhasil ditambahkan",
        "eggId": "BJWNFtiGK8mTTqK47Yvh"
      }
      ```

* **Retrieve Egg Data by Fertilization**
  * **Endpoint :** `get-eggs-by-fertilization`
  * **Method :** `Get`
  * **Body :** </br>
    `detectionTimestamp` as `timestamp`</br>
    `fertilization` as `boolean`</br>
    `phase` as `string`</br>
    `pixels` as `array`</br>
    `userId` as `string`
  * **response :**</br>
    * **status code :** 200</br>
      **body :**
      ```
      {
            "id": "gXiyut0OUs9r8TLEz2Se",
            "detectionTimestamp": {
                "_seconds": 1701162000,
                "_nanoseconds": 0
            },
            "fertilization": "Fertil",
            "pixels": [
                "[590,330,65]",
                "[764,45,45]"
            ],
            "phase": "Tahap Akhir",
            "userId": "CPFDmu1Fi4TwAIFXOQE9zWNeLr22"
      }
      /// dan data telur yang fertil lainnya
      ```

* **Retrieve All Egg Data based on Document ID**
  * **Endpoint :** `get-egg-by-id`
  * **Method :** `Get`
  * **Body :** </br>
    `detectionTimestamp` as `timestamp`</br>
    `fertilization` as `boolean`</br>
    `phase` as `string`</br>
    `pixels` as `array`</br>
    `userId` as `string`
  * **response :**</br>
    * **status code :** 200</br>
      **body :**
      ```
      {
          "status": "success",
          "egg": {
              "id": "gXiyut0OUs9r8TLEz2Se",
              "detectionTimestamp": {
                  "_seconds": 1701162000,
                  "_nanoseconds": 0
              },
              "fertilization": "Fertil",
              "pixels": [
                  "[590,330,65]",
                  "[764,45,45]"
              ],
              "phase": "Tahap Akhir",
              "userId": "CPFDmu1Fi4TwAIFXOQE9zWNeLr22"
          }
      }

* **Retrieve All User Data**
  * **Endpoint :** `/api/users`
  * **Method :** `Get`
  * **Body :** </br>
    `displayName` as `string`</br>
    `email` as `string`</br>
  * **response :**</br>
    * **status code :** 200</br>
      **body :**
      ```
      {
        "displayName": "Ambatukam",
        "email": "ambatukam@gmail.com"
      }
      /// dan data user lainnya
      ```

* **Predict Egg Images Based On UID**
  * **Endpoint :** `predict`
  * **Method :** `POST`
  * **Body :** </br>
    `label` as `string`</br>
    `userId` as `string`
    `images` as `file`
  * **response :** </br>
    * **status code :** 200 </br>
      **body :**
      ```
       {
           "timestamp": "22/12/2023, 14.26.35",
           "phase": [
            {
            "kelas": "Pertengahan",
            "probabilitas": 0.12300311861649722
             },
            {
            "kelas": "Tahap Akhir",
            "probabilitas": 0.009687491218578183
            },
            {
            "kelas": "Tahap Awal",
            "probabilitas": 99.76835661864924
             },
            {
            "kelas": "Telur Mati",
            "probabilitas": 0.09895277151569165
            }
            ],
           "imageURL": "https://storage.googleapis.com/avid-lock-405816.appspot.com/images/884vxsSk54ezneEdENpqvLk0GcN2/gambar_884vxsSk54ezneEdENpqvLk0GcN2_1703229994900.jpg",
           "userId": "884vxsSk54ezneEdENpqvLk0GcN2",
           "label": "foto kelima"
       }
      ```
