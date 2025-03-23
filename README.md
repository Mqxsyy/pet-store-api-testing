# Notes
Pets endpoints
- can add (POST) pet with only id; probably should not be possible
- invalid data types and too big numbers causes status 500 not mentioned in the docs
- if `-1` is considered an invalid id then should return status 404 instead of 400
- if `string` is considered an invalid id then should return status 404 instead of 400
- numbers and strings are considered valid statuses
- in updating (PUT) -1 seems to be a valid id
- in updating (PUT) always returns data, even when pet with that id doesn't exist

# Project setup
1. Clone repo
2. `npm i`
3. `npm run test`

# Tests

## POST `/pet`
### 1 
**it:** should add a pet and return valid data when all fields are defined  
**expects:** status 200

### 2 
**it:** should add a pet and return valid data when only required fields are defined  
**expects:** status 200

### 3 
**it:** should add a pet and return valid data when all fields are minimally defined  
**expects:** status 200

### 4 
**it:** should return 405 for invalid input  
**expects:** status 405

### 5 
**it:** should return 405 for invalid data types  
**expects:** status 405

## DELETE `/pet/{petId}`
### 1 
**it:** should delete pet  
**expects:** status 200

### 2 
**it:** should return 404 for pet not found  
**expects:** status 404

### 3 
**it:** should return 400 for invalid pet id (-1)  
**expects:** status 400

### 4 
**it:** should return 400 for invalid pet id (string)  
**expects:** status 400

## GET `/pet/{petId}`
### 1 
**it:** should return pet  
**expects:** status 200

### 2 
**it:** should return 404 for pet not found  
**expects:** status 404

### 3 
**it:** should return 400 for invalid pet id (-1)  
**expects:** status 400

### 4 
**it:** should return 400 for invalid pet id (string)  
**expects:** status 400

## GET `/pet/findByStatus`
### 1 
**it:** should return pet  
**expects:** status 200

### 2 
**it:** should return 400 for invalid status (string)  
**expects:** status 400 and everything to have `status: "pending"`

### 3 
**it:** should return 400 for invalid status (number)  
**expects:** status 400

## PUT `/pet`
### 1 
**it:** should update a pet and return updated data when all fields are defined  
**expects:** status 200 and updated data

### 2 
**it:** should update a pet and not return data when minimal fields are defined  
**expects:** status 200 and updated data

### 3 
**it:** should return 400 for invalid pet id (-1)  
**expects:** status 400

### 4 
**it:** should return 400 for invalid pet id (string)  
**expects:** status 400

### 5 
**it:** should return 400 for too big of a pet id  
**expects:** status 400

### 6 
**it:** should return 404 for pet not found  
**expects:** status 404
