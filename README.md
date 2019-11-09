<h1>Machine Learning, Deep Learning & XG Boost </h1>
<br>
<p> The models found in this repository were based on the data cleaned in the branch: <b>cleaning</b>. All of the models used data from 2018 to <b>TRAIN</b> whilst data from 2019 was used to <b>TEST</b> the models</p>
<br>
<p>The goal was to predict which workers that were active during 2018 would quit during 2019 by using Supervised Classification. The following scores were obtained in the latest test</p>
<ul>
    <li><b>Machine Learning:</b> was based on Logistic Regression. 
    <br>
        <ul>
        <li>Training Data Score: 0.7379</li>
        <li>Testing Data Score: 0.7332</li>
        </ul>
    </li>
    <br>
    <li><b>Deep Learning:</b> used a Sequential model with ReLU as the activation function and Categorical Crossentropy as the loss function
    <br>    
        <ul>
        <li>TRAINING - Loss: 0.1347, Accuracy: 0.9443</li>
        <li>TESTING - Loss: 2.1792, Accuracy: 0.7051</li>
        </ul>
    </li>
    <br>
    <li><b>XG Boost:</b> 
    <br>
        <ul>
        <li>Training Data Score: 0.8586</li>
        <li>Testing Data Score: 0.5063</li>
        </ul>
    </li>
</ul>
<br>
<p>The Machine Learning model was able to predict <b>65 out of 79 (82%) </b> workers who were active in 2018 and quit during 2019 </p>
<br>
<p>The results for the 3 tests done for the Deep Learning model are as follows:</p>
<br>
<p>Using the XG_Boost library, <b>76 out of 79 (96%) </b> workers were predicted </p>
<br>
<table>
<th>
<td>Actual</td>
<td>Prediction_1</td>
<td>%</td>
<td>Prediction_2</td>
<td>%</td>
<td>Prediction_3</td>
<td>%</td>
</th>
<tr>
<td></td>
<td>79</td>
<td>69</td>
<td>87%</td>
<td>64</td>
<td>81%</td>
<td>65</td>
<td>82%</td>
</tr>
</table>
<br>

![deep_learning](https://user-images.githubusercontent.com/51130786/68521526-8e451300-0267-11ea-966f-b40a67a03faf.PNG)

<p>We can see on the plot that predictions were fairly consistent across the Deep Learning iterations</p>

![final_comparison](https://user-images.githubusercontent.com/51130786/68534245-be3bf700-02f7-11ea-8797-ee6f49baa3b8.PNG)
