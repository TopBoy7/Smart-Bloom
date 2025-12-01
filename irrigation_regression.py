import numpy as np 
import pandas as pd


import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))

df = pd.read_csv(r"C:\Users\Pst Obafemi-Moses\Downloads\Irrigation Scheduling.csv")
print(df.head())

#import libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

#To display first five records
df.head(5)

#To display last five records
df.tail(5)

#To display class
df['class']

#describe() method returns description of the data in the DataFrame.
df.describe()

#To display number of rows and columns
df.shape

#To display number of columns, column labels, column data types, memory usage, range index, and the number of cells in each column (non-null values).
df.info()

type(df)

#To return data type of each column. 
df.dtypes

#To return the number of unique values for each column
df.nunique()

#To count the number of not empty values for each row
df.count()


#DATA WRANGLING/CLEANING

#Dropping unnecessary column 
df.drop("id",axis=1,inplace=True)

#Checking whether the column has been removed or not
df.head()

#To display the number of empty values (NaN,NAN,na) in each column
df.isna()


#Count the number of empty values (NaN,NAN,na) in each column
df.isna().sum()


#Filling the empty values(NaN,NAN,na) of column Altitude with average of all values of same column
df['altitude'].fillna(int(df['altitude'].mean()),inplace=True)

#Now checking the number of empty values (NaN,NAN,na) in Altitude column
df['altitude'].isna().sum()

#Checking the number of non empty values of each class
df['class'].value_counts()

#EXPLORING DATA ANALYSIS

#Visualization of data using matplotlib.pyplot library
import matplotlib.pyplot as plt
plt.hist(df['class'])
plt.show()

#Again getting number of non empty values of each class
df.groupby('class').size()


#Putting the count in a list
List=[366,1023,1842,1457]


#Visualizing it using piechart
import matplotlib.pyplot as plt
plt.pie(List,labels=["Dry","Very Dry","Very wet","Wet"])
plt.show()


#Visualization of data using seaborn library
import seaborn as sns
#Visualizing class using countplot
#A count plot is helpful when dealing with categorical values. It is used to plot the frequency of the different categories.
sns.countplot(x='class',data=df)


#ENCODING CATEGORICAL VALUES

#To display the values of column class
df.iloc[:,6].values


from sklearn.preprocessing import OneHotEncoder
onehot_encoder=OneHotEncoder()
df['class']=onehot_encoder.fit_transform(df[['class']]).toarray()
df['class'].values

#Now checking data type of column class
df['class'].dtype

#To display first 5 rows of new data
df.head(5)

#Finding the correlation 
#corr() function tells us how one column can influence the other
data=df.iloc[:,0:7].corr()
data


#Visualize the correlation of above data using heatmap
sns.heatmap(data,annot=True,fmt='.0%')


#MACHINE LEARNING

#Dividing data into X and Y(converting into numpy)
X=df.iloc[:,0:4].values  #Independent dataset 
Y=df.iloc[:,6].values    #Dependent dataset 

print(X)

print(Y)

#Splitting dataset into 80% training and 20% testing
from sklearn.model_selection import train_test_split
X_train,X_test,Y_train,Y_test=train_test_split(X,Y,test_size=0.20,random_state=0)


##from sklearn.metrics import precision_score, classification_report

##print(classification_report(Y_test, y_pred, zero_division=0))


from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

X_train

X_test

Y_train

Y_test



# MODEL 1: LOGISTIC REGRESSION 

#Fitting the Logistic Regression model on X and Y
from sklearn.linear_model import LogisticRegression
model1=LogisticRegression()
model1.fit(X_train,Y_train)


# prediction of this model 
pred1=model1.predict(X_test)


#Testing model accuracy on test data
from sklearn.metrics import accuracy_score
accuracy_score(Y_test,pred1)


#Confusion Matrix
from sklearn.metrics import confusion_matrix
print(confusion_matrix(Y_test,pred1))


#Classification report
from sklearn.metrics import classification_report
print(classification_report(Y_test,pred1))


#Fitting the Gaussian Naive Bayes Classifier model on X and Y
from sklearn.naive_bayes import GaussianNB
model2=GaussianNB()
model2.fit(X_train,Y_train) 


#prediction of this model
pred2=model2.predict(X_test)


#Testing model accuracy on test data
from sklearn.metrics import accuracy_score
accuracy_score(Y_test,pred2)


#Confusion Matrix
from sklearn.metrics import confusion_matrix
print(confusion_matrix(Y_test,pred2))


#Classification report
from sklearn.metrics import classification_report
print(classification_report(Y_test,pred2))


from sklearn.svm import SVC
model3=SVC(kernel='linear')
model3.fit(X_train,Y_train) 


# prediction of this model 
pred3=model3.predict(X_test)


#Testing model accuracy on test data
from sklearn.metrics import accuracy_score
print(accuracy_score(Y_test,pred3))


#Confusion Matrix
from sklearn.metrics import confusion_matrix
print(confusion_matrix(Y_test,pred3))


#Classification report
from sklearn.metrics import classification_report
print(classification_report(Y_test,pred3))