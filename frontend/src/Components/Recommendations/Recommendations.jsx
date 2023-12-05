import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export const Recommendations = ({ data }) => {

    const [recommendations, setRecommendations] = useState([])

    useEffect(() => {
        let Recommendations = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const mealInfo = data[i][0]
                let nutrientInfo = data[i][1]
                Object.keys(nutrientInfo).forEach((key) => {
                    if (nutrientInfo[key] === 0) {
                    if (key === "Protein" || key === "Total lipid (fat)" || key==="Vitamin B-12" || key === "Vitamin D" || key === "Copper, Cu" || key === "Vitamin B-6" || key === "Zinc, Zn") {
                        Recommendations.push(`The meal ${mealInfo.MealName} is low in ${key}.`)
                    }
                    if (nutrientInfo[key] === 0 && key==="Carbohydrate, by difference") {
                        Recommendations.push(`The meal ${mealInfo.MealName} is low in carbohydrates.`)
                    }
                    if (nutrientInfo[key] === 0 && key==="Iron, Fe") {
                        Recommendations.push(`The meal ${mealInfo.MealName} is low in iron.`)
                    }
                }
                })
            }
            console.log(Recommendations)
            if (Recommendations.length === 0) {
                Recommendations.push("You are eating healthy! No Recommendations for now.")
            }
            else {
                Recommendations.sort(() => Math.random() - 0.3);
                setRecommendations(Recommendations.slice(0, 2))
            }
        }
    }, [data])
    return (
        <div>
            <h1>Recommendations Component</h1>
            {recommendations.map((recommendation, index) => {
                return (
                    <div key={index}>
                        <p>{recommendation}</p>
                    </div>
                )
            })}
        </div>
    )
}

