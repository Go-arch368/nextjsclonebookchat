"use client";

import React, { useState } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { ChevronDown } from 'lucide-react';

const Zapier: React.FC = () => {
  const [inputValue, setInputValue] = useState('Zapier');
  const [isOpen, setIsOpen] = useState(false);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="mt-5 ">
      <div className="space-y-6">
        <div className="p-6 rounded-lg">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              className="w-full border bg-sky-300 text-black font-bold border-gray-300 hover:bg-white focus:ring-2 focus:ring-blue-500 p-6 pr-10 cursor-pointer"
              placeholder="Zapier"
            />
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {isOpen && (
            <div className="mt-10 p-6 bg-white shadow-lg rounded-lg text-center">
              <p className="mb-2 mt-2 font-bold text-2xl">Step 1</p>
              <span className="font-bold text-xl block mb-2">Click 'Make a Zap' on your Zapier Dashboard.</span>
              <Button
                className="w-[400px] p-2 bg-black text-white border border-gray-300 hover:bg-gray-100 mb-4 mx-auto block"
                onClick={() => console.log("MAKE A ZAP clicked")}
              >
                MAKE A ZAP
              </Button>
              <p className="mb-2 font-bold text-xl">Step 2</p>
              <span className="font-bold text-xl block mb-2">Search for the “Zotly” app and select it.</span>
              <p className="mb-2 font-bold text-xl">Step 3</p>
              <span className="font-bold text-xl block mb-2">Select a trigger event you want to integrate and click 'Continue'.</span>
              <p className="mb-2 font-bold text-xl">Step 4</p>
              <span className="font-bold text-xl block mb-2">Once you select your account, the new window will open or select one if you already have a configured account. The new window will be opened.</span>
              <p className="mb-2 font-bold text-lg">You will be asked to enter the API key. You can find it here:</p>
              <div className="text-left pl-4">
                <p className="mb-1">&bull; http://abc.com - cb10c3f43bdb44ccaaaf0401a5c727e</p>
                <p className="mb-1">&bull; http://cisco.com - 5e42a94b120a44d790fccf67323b6ac</p>
                <p className="mb-1">&bull; http://devtestloginwithgoogle.com - f30ab1cfc44b446c8eec7ac722eda6e</p>
                <p className="mb-1">&bull; http://nicramfaust-test.com - 793963a35397411699b97c9176b21c4</p>
                <p className="mb-1">&bull; http://nicramitsolutions-test.com - 9293e03c76144f0b88ce0a2d476f076</p>
                <p className="mb-1">&bull; http://oxnia.com - 0dc607d48b5340be8d052490d4f5644</p>
                <p className="mb-1">&bull; http://test-zapier.com - a5b95751e7534057b73615ff2c75810</p>
                <p className="mb-1">&bull; http://test-zotly-to-drift-flow.com - 77ec004fda074203b22e6905fe5bffb</p>
                <p className="mb-1">&bull; https://abc.com - 430bb25dc00f43b1be92c9499e053e0</p>
                <p className="mb-1">&bull; https://abc@gmail.com - 1a26327841a04327a8f76fe9c765173</p>
                <p className="mb-1">&bull; https://cdpresolution.com - 7e64c43fb14046d1bd1ea4a53f0c1e4</p>
                <p className="mb-1">&bull; https://chatmetrics.net - 97be6ef5bdb94331bfd3a897411f54e</p>
                <p className="mb-1">&bull; https://dasvaan.com - a50cc73f8a5f4c1ea7851f034576048</p>
                <p className="mb-1">&bull; https://delivr.ai - 2ed51b2c800549c2b1c6ef82a3c7a9d</p>
                <p className="mb-1">&bull; https://doctor.com - 2f207673e63c432c9203ae3e3446b29</p>
                <p className="mb-1">&bull; https://drift.com - 27891af402c04c2caffa5c253505764</p>
                <p className="mb-1">&bull; https://drift.com - 26ec24c136144cadbd210d4742a8064</p>
                <p className="mb-1">&bull; https://drift.com - 1bfa19cfc87b41e2be421a4fa54b6b0</p>
                <p className="mb-1">&bull; https://drift.com - 177fa71831a14e31838e0762004ce18</p>
                <p className="mb-1">&bull; https://faust-it-test.com - a8a3becd90cb4da9aea719c5d08cc06</p>
                <p className="mb-1">&bull; https://fox.com - 5177e203ec4e42e189b0749ec516174</p>
                <p className="mb-1">&bull; https://getchatmetrics.co - 9ca1f6ee16bb488d995c9ea11bf8b33</p>
                <p className="mb-1">&bull; https://homnicra.com - 8799b4f9599a4017b08638f521aa8b5</p>
                <p className="mb-1">&bull; https://localhost.pl - faa16bb1f94b474599917d69b1355ed</p>
                <p className="mb-1">&bull; https://n2n2.com - 27037d720efb4b37b53690123429e9c</p>
                <p className="mb-1">&bull; https://nextwebsitetest.com - 4be5319fd46a490180a5155656adc0b</p>
                <p className="mb-1">&bull; https://nicramt.com.pl - f8d752603d604fe08e9985458a63ce9</p>
                <p className="mb-1">&bull; https://nnni.com - cc23a4a24c8f46698e1b2e0158cc3c2</p>
                <p className="mb-1">&bull; https://ok.com - cf36f7704a3e4462a0da1e43185c5e8</p>
                <p className="mb-1">&bull; https://softspawn.ddns.net - 18b501b93a464c0b848ee07033b2f32</p>
                <p className="mb-1">&bull; https://spacecreatures.com - 4cb1f7c1977345b896d5d8e70a1250a</p>
                <p className="mb-1">&bull; https://swas.com - 33bfcc68df6841179d3b87542d14c3c</p>
                <p className="mb-1">&bull; https://swastechies.com/chat - bcabdcb7a4174b15a530307f8ba402f</p>
                <p className="mb-1">&bull; https://techska.com - efed4a9f0e344e99b442410a9e6ecd5</p>
                <p className="mb-1">&bull; https://techska.com/chattest/ - edda41cccfc04f57b35c8865669b97d</p>
                <p className="mb-1">&bull; https://techska.com/chattest2/ - c08350422f1c40aca485d9ed0ff8cb2</p>
                <p className="mb-1">&bull; https://techska.com/test/ - e7cf9fd073d94111bb8833b45caaec1</p>
                <p className="mb-1">&bull; https://techska.com/zotlystagingtest/ - 33a1aa5d6c9344d79d7b0f0baaabb09</p>
                <p className="mb-1">&bull; https://test-duplicate.com - 13b4bd02a701484e8ef32f60c419c3e</p>
                <p className="mb-1">&bull; https://test-integrations.com - 8e692d00376a43fe8f4c457c284c3c1</p>
                <p className="mb-1">&bull; https://test.ai - 651bf994608440a5978e5eeb26ac3e5</p>
                <p className="mb-1">&bull; https://test.com - 818297fbf35446ce906804e7f064776</p>
                <p className="mb-1">&bull; https://test.com - 7438d5ed27cf4ba2bb591388a31bdc2</p>
                <p className="mb-1">&bull; https://test.pl - 2e282994869342ebadd1789ea231f23</p>
                <p className="mb-1">&bull; https://testbetazotly.godaddysites.com/ - 4af03d4d038341ff9a1321ab6f88e9f</p>
                <p className="mb-1">&bull; https://testbug.com - b822597e2d9149678946f9bdcfca8bc</p>
                <p className="mb-1">&bull; https://time.com - 5921a7c1f0594394bf2686c2de4959d</p>
                <p className="mb-1">&bull; https://virtualletterbox.co - 5b99e692d44745f49574fcc3f4efecd</p>
                <p className="mb-1">&bull; https://www - c2b57f4f741f453a8fd64b189a8c40e</p>
                <p className="mb-1">&bull; https://www.chatmetrics.com - 2307727fcd6141488944646b71ea847</p>
                <p>&bull; https://www.route.com - abb3c2116fe44801a97e8cde8b0e548</p>
                <p>&bull; https://www.webstack.com.au/ - 9af56e929d1646be9f09391eb4d8935</p>
                <p>&bull; https://zotlychattest.mobirisesite.com/ - 6234a429ad944c6d92d9ee24036e456</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Zapier;