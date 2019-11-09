<h1>Machine Learning & Deep Learning </h1>
<br>
<p> The models found in this repository were based on the data cleaned in the branch: <b>cleaning</b>. Both Machine and Deep learning used data from 2018 to <b>TRAIN</b> whilst data from 2019 was used to <b>TEST</b> the models</p>
<br>
<p>The goal was to predict which workers that were active during 2018 would quit during 2019 by using Supervised Classification. The following scores were obtained in the latest test</p>
<ul>
    <li><b>Machine Learning:</b> was based on Logistic Regression. 
    <br>
        <ul>
        <li>Training Data Score: 0.7379826635145784</li>
        <li>Testing Data Score: 0.7332278095701936</li>
        </ul>
    </li>
    <br>
    <li><b>Deep Learning:</b> used a Sequential model with ReLU as the activation function and Categorical Crossentropy as the loss function
    <br>    
        <ul>
        <li>TRAINING - Loss: 0.134721790527715, Accuracy: 0.9443459510803223</li>
        <li>TESTING - Loss: 2.179290421868625, Accuracy: 0.7051016688346863</li>
        </ul>
    </li>
</ul>
<br>
<p>The Machine Learning model was able to predict <b>68 out of 89</b> workers who were active in 2018 and quit during 2019 </p>
<br>
<p>The results for the 3 tests done for the Deep Learning model are as follows:</p>
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
<td>89</td>
<td>69</td>
<td>77%</td>
<td>64</td>
<td>72%</td>
<td>65</td>
<td>73%</td>
</tr>
</table>