import * as tf from '@tensorflow/tfjs-node';
import * as PNGReader from '../ai_tensorflow/PngReader';
import * as fs from 'fs';
import data = require('../ai_tensorflow/data');
import { getRepository } from 'typeorm';
import { ImageResult } from '../entity/ImageResult';

const path = require('path');

export class AI_Tensorflow {

    private imageRepository = getRepository(ImageResult);

    toArrayBuffer(data) {
        let buf = data;
        console.log(buf)
        let ab = new ArrayBuffer(buf.length)
        let view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; i++) {
            view[i] = buf[i]
        }
        return ab;
    }

    async evaluateAndSave(request, response, next) {
        try {
            const path = tf.io.fileSystem("./src/ai_tensorflow/model/model.json")
            const model = await tf.loadLayersModel(path);
            const arrBuffer = this.toArrayBuffer(request.files.file.data);
            let pixels, result;

            await new Promise<void>((resolve, reject) => {
                const reader = new PNGReader(arrBuffer);
                return reader.parse((error, png) => {
                    pixels = Float32Array.from(png.pixels).map((pixel) => {
                        return pixel / 255;
                    });
                    resolve();
                });
            });

            let imageAsTensor = tf.tensor2d(pixels, [1, 28 * 28]);
            imageAsTensor = imageAsTensor.reshape([1, 28, 28, 1]);
            const modelPrediction = ((await model.predict(imageAsTensor)) as tf.Tensor).argMax(-1);
            imageAsTensor.dispose();
            result = await modelPrediction.array()

            const image = {
                name: request.files.file.name,
                size: request.files.file.size,
                result: result[0],
                link: "/image-link",
            };

            this.imageRepository.save(image);
            response.status(200).send("success");

        } catch (error) {
            console.log(error)
            response.status(500).send(error);
        }
    }

    async readImages(request, response, next) {
        return this.imageRepository.find();
    }

}