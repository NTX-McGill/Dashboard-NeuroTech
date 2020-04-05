import React, { useEffect, useState } from "react";
import Sketch from "react-p5";

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function P5Component() {
  let [points, setPoints] = useState([]);

  useEffect(() => {
      let id = setInterval(() => {
        setPoints(points => [...points.slice(1), getRandomArbitrary(100, 300)]);
      }, 300);
      return () => clearInterval(id);
  }, [points]);

  let setup = (p5, parentRef) => {
    p5.createCanvas(400, 400).parent(parentRef);

    for (let i = 0; i < 400; i++)
      setPoints(points => [...points, getRandomArbitrary(100, 300)]);
  };

  let draw = p5 => {
    p5.background(200);

    p5.stroke(0);
    let px = 0;
    let py = points[0];
    for (let i = 0; i < points.length; i++) {
      let x = i * (400 / (25 - 1));
      let y = points[i];

      p5.line(px, py, x, y);

      px = x;
      py = y;
    }
  };

  return (
    <div>
      <Sketch {...{ setup, draw }} />
    </div>
  );
}

export default P5Component;
