# Wanderlust

## Main Idea

The main idea to is to assist the user in discovering new places to explore and to inspire the user to travel to these new destinations. 

## Github repo 
https://github.com/sourabh2k15/wanderlust

## Demo ( deployed on azure )
http://wanderlust-go.azurewebsites.net/

## Introduction 

The root origin of this idea was when I saw a friend's Instagram account showcasing pictures of a beautiful place in India (Triund ) that neither I or any of my Indian friends had heard of before. This caused a curiosity in me that maybe not all amazing travel spots have been indexed yet? but then what is the probability of this being the case in an age when Google can literally tell your position within 10 cm accuracy, turns out the information is all out there but nobody would go out of their way normally to get the information. For example, if you are traveling to India you would search "places to visit in India" which would return a list of popular destinations, but if you take more time and follow the below algorithm (pseudo code )

c <- country
n <- provinces in c

for i<- i to n do 
  aggregate of (google search "<province_name> <country> must-visit spots")
end
  
Now you atleast have the best spots in your list to choose from as opposed to before so I hope that increases the probability of having a more enjoyable trip and maybe discover entirely new experiences in a place nearby home ;) 

## Wanderer (1st part) 
![wanderer_demo](https://media.giphy.com/media/d47INmanbCHchaBa/giphy.gif)

Our webapp is divided into 3 parts. Wanderer is a web crawler written in **NodeJS+Selenium** that fetches the must-visit spots for every province in every country on the globe through the google search answer-box and Tripadvisor. One could also crawl Instagram images if data from aforementioned sources is scarse. It deals with collecting the data for the must visit spots for each country and for each province in those countries. These places would be used in the 2nd part of the app where the user can choose from these places to explore more. 

Challenges faced : 

Had to come up with novel strategies in order to extract relevant information from huge chunks of HTML. Learnt Selenium from scratch, how to emulate button clicks, execute async scripts on the page. 

## DestinyMap (2nd part)

![destinymap demo](https://i.imgur.com/LO5LWkw.png)

The user is provided a world map ( powered by Bing Maps API) with markers on the locations Wanderer had discovered. The user can click on a marker to get images for that location ( **Bing Image search API** used with some custom params). If the user is sold on that place we then guide the user how to get to that place in 3rd part. One could also use **Microsoft Cognitive Services API** to extract the features of the images and only pass on the ones satisying certain criteria pertaining to if they look aesthetic or not. For example, a black and white image or an image fully crowded with people doesn't contribute much to impress the user about the place whereas a good scenery, snow, sunset , sunrise such pics raise user interest levels.
This app is the main user facing site and is **deployed on azure**. It is built using NodeJS+Express. 

Challenges faced :

Learnt how to use the Bing maps API and went through the documentation to learn about creating **PushPins** and custom **InfoBoxes**

## Teleport (3rd part)

Google flights API is used to fetch the flight information between source and destination. For hotel booking and review information expedia API is used. 
