import React, { useState, useEffect } from "react";
import { Search, RotateCcw, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

// Zod schemas for validation
const step1Schema = z.object({
  botName: z.string().min(1, { message: "Bot name is required" }),
  broker: z.string().min(1, { message: "Broker is required" }),
  botType: z.string().min(1, { message: "Bot type is required" }),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
});

const apiConnectSchema = z.object({
  apiKey: z.string().min(1, { message: "API key is required" }),
  secretKey: z.string().min(1, { message: "Secret key is required" }),
});

const step2Schema = z.object({
  assetName: z.string().min(1, { message: "Asset name is required" }),
  amountPerBuy: z.number().min(10, { message: "Minimum amount is 10 USD" }),
  timeFrame: z.string().min(1, { message: "Time frame is required" }),
  frequency: z.number().min(1, { message: "Frequency is required" }),
  loop: z.string().min(1, { message: "Loop option is required" }),
  amountOfTimes: z.number().optional().refine(val => {
    // Only required when loop is 'Custom'
    return val !== undefined && val > 0;
  }, { message: "Amount of times is required for Custom loop" }),
});

type Step1FormData = z.infer<typeof step1Schema>;
type Step2FormData = z.infer<typeof step2Schema>;

interface BotSetupProps {
  onBack?: () => void;
}

const BotSetup: React.FC<BotSetupProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedBotType, setSelectedBotType] = useState("Basic");
  const [currentMainStep, setCurrentMainStep] = useState(1); // 1 = Bot details, 2 = Asset details, 3 = Confirm & deploy
  const [currentSubStep, setCurrentSubStep] = useState(1); // 1 = basic details, 2 = API connect, 3 = success
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyBotData, setModifyBotData] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    botName: '',
    asset: '',
    amount: 0,
    timeFrame: '',
    frequency: 1,
    loop: 'Once',
    amountOfTimes: 0,
    broker: '',
    botType: ''
  });

  // Step 1 form
  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      botName: "BTCUSDT",
      broker: "ByBit",
      botType: "Basic",
    }
  });

  // Watch broker value for real-time updates
  const brokerValue = step1Form.watch("broker");

  // Step 2 form
  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      assetName: "BTCUSDT",
      amountPerBuy: 50,
      timeFrame: "1Day",
      frequency: 1,
      loop: "Once",
      amountOfTimes: undefined,
    }
  });

  // API Connect form
  const apiConnectForm = useForm({
    resolver: zodResolver(apiConnectSchema),
    defaultValues: {
      apiKey: "123asdsad45erere6asdsad789...",
      secretKey: "**********************************",
    }
  });

  const [formData, setFormData] = useState({
    botName: "BTCUSDT",
    broker: "ByBit"
  });

  // Check if we're in modify mode and load bot data
  useEffect(() => {
    const modifyMode = searchParams.get('modify') === 'true';
    setIsModifyMode(modifyMode);
    
    if (modifyMode) {
      const storedBotData = localStorage.getItem('modifyBotData');
      if (storedBotData) {
        const botData = JSON.parse(storedBotData);
        setModifyBotData(botData);
        
        // Pre-fill the forms with bot data
        step1Form.setValue('botName', botData.name);
        step1Form.setValue('broker', 'ByBit'); // Default broker
        step1Form.setValue('botType', botData.strategy.replace('DCA-', ''));
        
        step2Form.setValue('assetName', botData.pair);
        step2Form.setValue('amountPerBuy', parseFloat(botData.totalInvestment.replace('$', '')));
        step2Form.setValue('timeFrame', botData.investmentFrequency);
        step2Form.setValue('frequency', parseInt(botData.count));
        
        // Set loop value from bot data or default to 'Once'
        const loopValue = botData.loop || 'Once';
        step2Form.setValue('loop', loopValue);
        
        // Set amountOfTimes if loop is 'Custom'
        if (loopValue === 'Custom' && botData.amountOfTimes) {
          step2Form.setValue('amountOfTimes', botData.amountOfTimes);
        }
        
        setSelectedBotType(botData.strategy.replace('DCA-', ''));
        setFormData({
          botName: botData.name,
          broker: 'ByBit'
        });
        
        // Set edit values for inline editing
        setEditValues({
          botName: botData.name,
          asset: botData.pair,
          amount: parseFloat(botData.totalInvestment.replace('$', '')),
          timeFrame: botData.investmentFrequency,
          frequency: parseInt(botData.count),
          loop: loopValue,
          amountOfTimes: loopValue === 'Custom' ? (botData.amountOfTimes || 1) : 0,
          broker: 'ByBit',
          botType: botData.strategy.replace('DCA-', '')
        });
        
        // In modify mode, go directly to step 3 (review details)
        setCurrentMainStep(3);
      }
    }
  }, [searchParams, step1Form, step2Form]);

  // Validation functions
  const validateStep1 = async () => {
    try {
      await step1Form.trigger();
      return step1Form.formState.isValid;
    } catch {
      return false;
    }
  };

  const validateStep2 = async () => {
    try {
      await step2Form.trigger();
      return step2Form.formState.isValid;
    } catch {
      return false;
    }
  };

  const validateSubStep1 = async () => {
    try {
      await step1Form.trigger(['botName', 'broker', 'botType']);
      return step1Form.formState.errors.botName === undefined && 
             step1Form.formState.errors.broker === undefined && 
             step1Form.formState.errors.botType === undefined;
    } catch {
      return false;
    }
  };

  const handleNextStep = async () => {
    if (currentMainStep === 1) {
      const isValid = await validateStep1();
      if (isValid) {
        setCurrentMainStep(2);
      }
    } else if (currentMainStep === 2) {
      const isValid = await validateStep2();
      if (isValid) {
        setCurrentMainStep(3);
      }
    }
  };

  const handleNextSubStep = async () => {
    if (currentSubStep === 1) {
      const isValid = await validateSubStep1();
      if (isValid) {
        setCurrentSubStep(2);
      }
    } else if (currentSubStep === 2) {
      // For API connect step, validate if user wants to connect
      try {
        await apiConnectForm.trigger();
        if (apiConnectForm.formState.isValid) {
          setCurrentSubStep(3);
        }
      } catch {
        // If validation fails, stay on current step
      }
    }
  };

    const handleReset = () => {
    // Show confirmation dialog
    const message = isModifyMode 
      ? "Are you sure you want to reset all changes? This will clear all modifications and return to the default form."
      : "Are you sure you want to reset the form? This will clear all entered data and return to the initial state.";
    
    if (window.confirm(message)) {
      // Reset all forms to default values
      step1Form.reset({
        botName: "BTCUSDT",
        broker: "ByBit",
        botType: "Basic",
      });
      
      step2Form.reset({
        assetName: "BTCUSDT",
        amountPerBuy: 50,
        timeFrame: "1Day",
        frequency: 1,
        loop: "Once",
      });
      
      apiConnectForm.reset({
        apiKey: "123asdsad45erere6asdsad789...",
        secretKey: "**********************************",
      });
      
      // Reset state
      setSelectedBotType("Basic");
      setCurrentMainStep(1);
      setCurrentSubStep(1);
      setEditingField(null);
      setEditValues({
        botName: '',
        amountOfTimes: 0,
        asset: '',
        amount: 0,
        timeFrame: '',
        frequency: 1,
        loop: 'Once',
        broker: '',
        botType: ''
      });
      setFormData({
        botName: "BTCUSDT",
        broker: "ByBit"
      });
      
      // Clear modify data if in modify mode
      if (isModifyMode) {
        localStorage.removeItem('modifyBotData');
        setIsModifyMode(false);
        setModifyBotData(null);
      }
      
      // Show toast notification
      toast.success("Form reset successfully", {
        description: isModifyMode 
          ? "All modifications have been cleared and form reset to default"
          : "All fields have been cleared and reset to initial state"
      });
    }
  };

  const handleDeployBot = () => {
    console.log("Deploy bot clicked!");

    if (isModifyMode && modifyBotData) {
      // Update existing bot
      const updatedBot = {
        ...modifyBotData,
        name: editValues.botName,
        pair: editValues.asset,
        strategy: `DCA-${editValues.botType}`,
        totalInvestment: `$${editValues.amount.toFixed(2)}`,
        investmentFrequency: editValues.timeFrame,
        nextBuySignal: `Next buy signal in ${editValues.timeFrame}`,
        count: String(editValues.frequency),
        loop: editValues.loop,
        amountOfTimes: editValues.loop === 'Custom' ? editValues.amountOfTimes : undefined,
      };

      console.log("Updated bot data:", updatedBot);

      // Update the existing bot in localStorage
      const existingBots = JSON.parse(localStorage.getItem('deployedBots') || '[]');
      const updatedBots = existingBots.map((bot: any) => 
        bot.id === modifyBotData.id ? updatedBot : bot
      );
      localStorage.setItem('deployedBots', JSON.stringify(updatedBots));
      
      // Clear modify data
      localStorage.removeItem('modifyBotData');
      
      // Show success toast
      toast.success("Bot updated successfully", {
        description: `${updatedBot.name} has been modified with new settings`
      });
      
      console.log("Bot updated in localStorage");
    } else {
      // Create new bot
      const currentTime = new Date();
      const loopValue = step2Form.getValues("loop") || "Once";
      const newBot = {
        id: Date.now(), // Generate unique ID
        name: step1Form.getValues("botName") || "MyDCA-1",
        pair: step2Form.getValues("assetName") || "BTCUSDT",
        strategy: `DCA-${step1Form.getValues("botType") || "Basic"}`,
        totalValue: `$${(step2Form.getValues("amountPerBuy") || 50).toFixed(2)}`,
        totalInvestment: `$${(step2Form.getValues("amountPerBuy") || 50).toFixed(2)}`,
        realizedPnl: "$0.00",
        totalReturn: "0%",
        chart: true,
        status: "Active",
        statusColor: "bg-green-500",
        runtime: "0d 0h 0m",
        account: "My Account",
        paused: false,
        statusSince: "Active since: Just now",
        botId: `bot-${Date.now()}`,
        investmentFrequency: step2Form.getValues("timeFrame") || "1Day",
        nextBuySignal: `Next buy signal in ${step2Form.getValues("timeFrame") || "1Day"}`,
        count: String(step2Form.getValues("frequency") || 1),
        isPositive: true,
        loop: loopValue,
        amountOfTimes: loopValue === 'Custom' ? step2Form.getValues("amountOfTimes") : undefined,
        // Add timestamp fields for real-time calculations
        createdAt: currentTime.toISOString(),
        lastStatusChange: currentTime.toISOString(),
        totalPausedTime: 0, // Total paused time in milliseconds
        lastPausedAt: null
      };

      console.log("New bot data:", newBot);

      // Store the new bot in localStorage
      const existingBots = JSON.parse(localStorage.getItem('deployedBots') || '[]');
      console.log("Existing bots:", existingBots);
      existingBots.push(newBot);
      localStorage.setItem('deployedBots', JSON.stringify(existingBots));
      
      // Show success toast
      toast.success("Bot deployed successfully", {
        description: `${newBot.name} has been deployed and is now active`
      });
      
      console.log("Bots saved to localStorage");
    }

    // Navigate to dashboard and force a refresh
    console.log("Navigating to dashboard...");
    navigate('/dashboard', { replace: true });

    // Force a small delay then reload to ensure the dashboard updates
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const instruments = [
    { title: "Trade or Invest", description: "Description & some performance data" },
    { title: "Portfolio or Rebalancer", description: "Description & some perform" },
    { title: "Buy & Hold", description: "Description & some perform" },
    { title: "Investoaccumulator", description: "Description & some performance data" },
    { title: "Proprietary", description: "Coming soon* in 2026", comingSoon: true },
    { title: "Arbitrage", description: "Coming soon* in 2026", comingSoon: true }
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto pl-8 md:pl-20 py-8">
        {/* Back Button */}
        {/* <button 
          className="flex items-center text-gray-600 hover:text-green-600 mb-6"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button> */}

        {/* Instrument Selection Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8 lg:ml-2">
          {/* Currently Selected */}
          <div className="lg:w-1/3 lg:ml-10 lg:mr-6">
            <h3 className="font-sm text-3xl text-gray-800 mb-4">Currently selected</h3>
            <div className="text-white rounded-lg p-4 h-48 flex flex-col justify-between" style={{ backgroundColor: "#3e8a29" }}>
              <h4 className="text-4xl font-semibold">Dollar Cost Average</h4>
              <p className="text-lg opacity-90 text-center">Description & some performance data</p>
            </div>
          </div>

          {/* All Instruments */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-medium text-gray-500">All instruments</h3>
              <button 
                onClick={handleReset}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instruments.map((instrument, index) => (
                <div
                  key={index}
                  className="text-white rounded-lg p-2 h-24 flex flex-col justify-between relative" style={{ backgroundColor: "#7f7f7f" }}
                >
                  <h4 className="text-2xl font-medium text-white">{instrument.title}</h4>
                  <p className="text-sm text-gray-300">{instrument.description}</p>
                  {/* {instrument.comingSoon && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      Coming soon
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bot Setup Progress */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="w-full h-0.5 bg-gray-200 mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Let's get your bot running</h2>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                currentMainStep >= 1 
                  ? currentSubStep === 3 
                    ? "bg-green-600 text-white" 
                    : "bg-white border-4 border-green-600 text-black"
                  : "bg-gray-300 text-gray-500"
              }`}>
                {currentMainStep >= 1 && currentSubStep === 3 ? <Check className="w-6 h-6" /> : "1"}
              </div>
              <span className={`mt-2 text-lg font-bold ${
                currentMainStep >= 1 ? "text-black" : "text-gray-500"
              }`}>
                {currentMainStep >= 1 && currentSubStep === 3 ? "Bot details complete!" : "Bot details"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-8 -mt-6"></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl ${
                currentMainStep >= 2 
                  ? currentMainStep > 2 
                    ? "bg-green-600 text-white" 
                    : "bg-white border-4 border-green-600 text-black"
                  : "bg-gray-300 text-gray-500"
              }`}>
                {currentMainStep > 2 ? <Check className="w-6 h-6" /> : "2"}
              </div>
              <span className={`mt-2 text-lg font-bold ${
                currentMainStep >= 2 ? "text-black" : "text-gray-500"
              }`}>
                {currentMainStep > 2 ? "Asset details complete!" : "Asset details"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-8 -mt-6"></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl ${
                currentMainStep === 3 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-300 text-gray-500"
              }`}>
                3
              </div>
              <span className={`mt-2 text-lg ${
                currentMainStep >= 3 ? "text-black font-bold" : "text-gray-500"
              }`}>
                Confirm & deploy
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mb-6"></div>

        {/* Progress Indicator - Outside the box */}
        <div className="flex justify-center mb-6 relative">
          <div className="w-16 h-16 bg-green-600 border-2 border-white rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
            {currentMainStep === 1 ? "1" : currentMainStep === 2 ? "2" : "3"}
          </div>
        </div>

        {/* Bot Details Form */}
        {currentMainStep === 1 ? (
          currentSubStep === 1 ? (
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
            {/* Arrow Button - Positioned on the right side of the card */}
            {currentMainStep === 1 && currentSubStep === 1 && (
              <button 
                className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                onClick={handleNextSubStep}
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
            {/* Section Title */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Enter basic bot details</h3>
              <div className="w-full h-0.5 bg-green-600 mx-auto"></div>
            </div>

            <div className="space-y-4">
              {/* Bot Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot name*
                </label>
                <input
                  type="text"
                  {...step1Form.register("botName")}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold uppercase ${
                    step1Form.formState.errors.botName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step1Form.formState.errors.botName && (
                  <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botName.message}</div>
                )}
              </div>

              {/* Broker */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Broker*
                  </label>
                  <button 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    onClick={handleNextSubStep}
                  >
                    Connect API Keys
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    {...step1Form.register("broker")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold pr-8 ${
                      step1Form.formState.errors.broker ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-green-600">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {step1Form.formState.errors.broker && (
                  <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.broker.message}</div>
                )}
              </div>

              {/* Bot Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select bot type*
                </label>
                <div className="flex space-x-2">
                  {["Basic", "Smart", "Advance"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedBotType(type);
                        step1Form.setValue("botType", type);
                      }}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        selectedBotType === type
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {step1Form.formState.errors.botType && (
                  <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botType.message}</div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Basic: DCA bot lets you buy an asset at a specified time and frequency of your choice.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Eg: We will create a DCA bot that buys Bitcoin every once a week on Sunday.
                  </p>
                </div>
              </div>
            </div>
          </div>
          ) : currentSubStep === 2 ? (
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
              {/* Arrow Button - Positioned on the right side of the card */}
              {currentMainStep === 1 && currentSubStep === 2 && (
                <button 
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  onClick={handleNextSubStep}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
              {/* Section Title */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enter basic bot details</h3>
                <div className="w-full h-0.5 bg-green-600 mx-auto"></div>
              </div>

              <div className="space-y-4">
                {/* API Connect Section */}
                <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">API Connect for {brokerValue || "ByBit"}</h4>
                  
                  <div className="space-y-4">
                    {/* API Key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API key*
                      </label>
                      <input
                        type="text"
                        {...apiConnectForm.register("apiKey")}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-500 ${
                          apiConnectForm.formState.errors.apiKey ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {apiConnectForm.formState.errors.apiKey && (
                        <div className="text-red-600 text-sm mt-1">{apiConnectForm.formState.errors.apiKey.message}</div>
                      )}
                    </div>

                    {/* Secret Key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret key*
                      </label>
                      <input
                        type="password"
                        {...apiConnectForm.register("secretKey")}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                          apiConnectForm.formState.errors.secretKey ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {apiConnectForm.formState.errors.secretKey && (
                        <div className="text-red-600 text-sm mt-1">{apiConnectForm.formState.errors.secretKey.message}</div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                                          <button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                      onClick={handleNextSubStep}
                    >
                      Connect
                    </button>
                      <button 
                        className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                        onClick={() => setCurrentSubStep(1)}
                      >
                        Skip for now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
              {/* Arrow Button - Positioned on the right side of the card */}
              {currentMainStep === 1 && currentSubStep === 3 && (
                <button 
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  onClick={handleNextStep}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
              {/* Section Title */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enter basic bot details</h3>
                <div className="w-full h-0.5 bg-green-600 mx-auto"></div>
              </div>

              <div className="space-y-4">
                              {/* Bot Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot name*
                </label>
                <input
                  type="text"
                  {...step1Form.register("botName")}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold uppercase ${
                    step1Form.formState.errors.botName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step1Form.formState.errors.botName && (
                  <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botName.message}</div>
                )}
              </div>

              {/* Broker */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Broker*
                  </label>
                  <span className="text-green-600 font-medium text-sm">API Keys successfully added!</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    {...step1Form.register("broker")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold pr-8 ${
                      step1Form.formState.errors.broker ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-green-600">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {step1Form.formState.errors.broker && (
                  <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.broker.message}</div>
                )}
              </div>

              {/* Bot Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select bot type*
                </label>
                <div className="flex space-x-2">
                  {["Basic", "Smart", "Advance"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedBotType(type);
                        step1Form.setValue("botType", type);
                      }}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        selectedBotType === type
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {step1Form.formState.errors.botType && (
                  <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botType.message}</div>
                )}
              </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Basic: DCA bot lets you buy an asset at a specified time and frequency of your choice.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Eg: We will create a DCA bot that buys Bitcoin every once a week on Sunday.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : currentMainStep === 2 ? (
          // Dynamic Step 2 based on bot type
          selectedBotType === "Smart" ? (
            // Smart DCA Layout
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-6xl mx-auto border border-gray-200 relative">
              {/* Arrow buttons */}
              <button className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors" onClick={() => setCurrentMainStep(1)}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors" onClick={handleNextStep}>
                <ArrowRight className="w-6 h-6" />
              </button>
              
              {/* Main Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">Step 2 asset details page</h3>
                <div className="w-full h-0.5 bg-green-500 mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Asset Details */}
                <div className="space-y-6">
                  {/* Left Panel Title */}
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-lg font-semibold text-black">Enter asset details & configuration</h4>
                    <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">DCA Smart</div>
                  </div>

                  {/* Asset Name */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Asset name*</label>
                    <div className="relative">
                      <input type="text" {...step2Form.register("assetName")} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                        step2Form.formState.errors.assetName ? 'border-red-300' : 'border-gray-300'
                      }`} />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-black hover:text-green-600">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                    {step2Form.formState.errors.assetName && (
                      <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.assetName.message}</div>
                    )}
                  </div>

                  {/* Amount per Buy */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-black">Amount per Buy* ($)</label>
                      <span className="text-blue-600 text-xs">Minimum amount is 10 USD</span>
                    </div>
                    <input type="number" {...step2Form.register("amountPerBuy", { valueAsNumber: true })} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                      step2Form.formState.errors.amountPerBuy ? 'border-red-300' : 'border-gray-300'
                    }`} />
                    {step2Form.formState.errors.amountPerBuy && (
                      <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountPerBuy.message}</div>
                    )}
                  </div>

                  {/* Time Frame and Frequency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Time frame*</label>
                      <select {...step2Form.register("timeFrame")} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black bg-white ${
                        step2Form.formState.errors.timeFrame ? 'border-red-300' : 'border-gray-300'
                      }`}>
                        <option value="">Select time frame</option>
                        <option value="1Day">1 Day</option>
                        <option value="1Week">1 Week</option>
                        <option value="1Month">1 Month</option>
                        <option value="3Months">3 Months</option>
                        <option value="6Months">6 Months</option>
                        <option value="1Year">1 Year</option>
                      </select>
                      {step2Form.formState.errors.timeFrame && (
                        <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.timeFrame.message}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Frequency*</label>
                      <input type="number" {...step2Form.register("frequency", { valueAsNumber: true })} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                        step2Form.formState.errors.frequency ? 'border-red-300' : 'border-gray-300'
                      }`} />
                      {step2Form.formState.errors.frequency && (
                        <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.frequency.message}</div>
                      )}
                    </div>
                  </div>

                  {/* Loop */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-3">Loop*</label>
                    <div className="flex space-x-6 mb-2">
                      {["Once", "Infinite", "Custom"].map((option) => (
                        <label key={option} className="flex items-center">
                          <input type="radio" name="loop" value={option} checked={step2Form.watch("loop") === option} className="w-4 h-4 text-green-500 border-green-500 focus:ring-green-500" onChange={(e) => {
                            step2Form.setValue("loop", option);
                            if (option === "Custom") {
                              step2Form.setValue("amountOfTimes", 1);
                            } else {
                              step2Form.setValue("amountOfTimes", undefined);
                            }
                          }} />
                          <span className="ml-2 text-sm text-black">{option}</span>
                        </label>
                      ))}
                    </div>
                    {step2Form.formState.errors.loop && (
                      <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.loop.message}</div>
                    )}
                    <p className="text-blue-600 text-xs">Eg: 1 time for 1 day</p>
                    
                    {/* Amount of Times - Only shown when Custom is selected */}
                    {step2Form.watch("loop") === "Custom" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-black mb-2">Amount of times*</label>
                        <input type="number" {...step2Form.register("amountOfTimes", { valueAsNumber: true })} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                          step2Form.formState.errors.amountOfTimes ? 'border-red-300' : 'border-gray-300'
                        }`} />
                        {step2Form.formState.errors.amountOfTimes && (
                          <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountOfTimes.message}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel: Risk Metrics Selection */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-black">Risk Metrics Selection (Upto 10, 0 Added)</h4>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Risk Metric Cards */}
                  <div className="space-y-4">
                    {/* Risk Metric for Bitcoin & Ethereum */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start space-x-4">
                        {/* Left: Chart */}
                        <div>
                          <div className="w-32 h-32 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-md border border-gray-300 overflow-hidden shadow-sm relative">
                            {/* Horizontal red line at 0.5 (middle) */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 transform -translate-y-1/2"></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-1 w-32">
                            <span>0.2</span>
                            <span>0.8</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-600 w-32">
                            <span>Lower risk zone</span>
                            <span>High risk zone</span>
                          </div>
                        </div>
                        
                        {/* Middle: Title, Description, ADD Button */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-black">Risk Metric for Bitcoin & Ethereum</h5>
                            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-[10px] text-gray-700 font-bold">i</span>
                            </div>
                          </div>
                          <p className="text-xs leading-5 text-gray-600 mb-3 text-left">
                            BTC Risk Metric shows if Bitcoin is historically cheap or expensive based on past prices and trends. Lower values mean it's potentially a better time to buy, higher values mean it's riskier.
                          </p>
                          <div className="flex">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                              ADD
                            </button>
                          </div>
                        </div>
                        
                        {/* Right: Current Metric */}
                        <div className="text-center">
                          <div className="border border-gray-200 rounded-md bg-white px-4 py-3 w-28 shadow-sm">
                            <div className="text-xs text-gray-600 mb-1">Current metric</div>
                            <div className="text-lg font-bold text-black">0.5</div>
                            <div className="mt-1 inline-block text-xs text-black bg-yellow-200 px-2 py-0.5 rounded">Moderate</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fear & Greed Index */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start space-x-4">
                        {/* Left: Chart */}
                        <div>
                          <div className="w-32 h-32 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded relative">
                            {/* Horizontal white line with circle at 70% position */}
                            <div className="absolute top-[30%] left-0 right-0 h-0.5 bg-white"></div>
                            <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-gray-300"></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-1 w-32">
                            <span>20</span>
                            <span>80</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-600 w-32">
                            <span>Extreme fear</span>
                            <span>Extreme greed</span>
                          </div>
                        </div>
                        
                        {/* Middle: Title, Description, ADD Button */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-black">Fear & Greed Index (Crypto)</h5>
                            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-[10px] text-gray-700 font-bold">i</span>
                            </div>
                          </div>
                          <p className="text-xs leading-5 text-gray-600 mb-3 text-left">
                            Crypto Fear & Greed Index reflects market emotions. 0 means extreme fear (people selling), 100 means extreme greed (people buying aggressively).
                          </p>
                          <div className="flex">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                              ADD
                            </button>
                          </div>
                        </div>
                        
                        {/* Right: Current Metric */}
                        <div className="text-center">
                          <div className="border border-gray-200 rounded-md bg-white px-4 py-3 w-28 shadow-sm">
                            <div className="text-xs text-gray-600 mb-1">Current metric</div>
                            <div className="text-lg font-bold text-black">70</div>
                            <div className="mt-1 inline-block text-xs text-black bg-green-200 px-2 py-0.5 rounded">Greed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Basic DCA Layout (existing code)
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
              {/* Left Arrow Button - Positioned on the left side of the card */}
              {currentMainStep === 2 && (
                <button 
                  className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  onClick={() => setCurrentMainStep(1)}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              {/* Right Arrow Button - Positioned on the right side of the card */}
              {currentMainStep === 2 && (
                <button 
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  onClick={handleNextStep}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
              {/* Section Title */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">Enter asset details</h3>
                <div className="w-full h-0.5 bg-green-500 mx-auto"></div>
              </div>

              <div className="space-y-6">
                {/* Asset Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Asset name*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...step2Form.register("assetName")}
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                        step2Form.formState.errors.assetName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-black hover:text-green-600">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                  {step2Form.formState.errors.assetName && (
                    <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.assetName.message}</div>
                  )}
                </div>

                {/* Amount per Buy */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-black">
                      Amount per Buy* ($)
                    </label>
                    <span className="text-blue-600 text-xs">Minimum amount is 10 USD</span>
                  </div>
                  <input
                    type="number"
                    {...step2Form.register("amountPerBuy", { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                      step2Form.formState.errors.amountPerBuy ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {step2Form.formState.errors.amountPerBuy && (
                    <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountPerBuy.message}</div>
                  )}
                </div>

                {/* Time Frame and Frequency - Side by Side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Time frame*
                    </label>
                    <select
                      {...step2Form.register("timeFrame")}
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black bg-white ${
                        step2Form.formState.errors.timeFrame ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select time frame</option>
                      <option value="1Day">1 Day</option>
                      <option value="1Week">1 Week</option>
                      <option value="1Month">1 Month</option>
                      <option value="3Months">3 Months</option>
                      <option value="6Months">6 Months</option>
                      <option value="1Year">1 Year</option>
                    </select>
                    {step2Form.formState.errors.timeFrame && (
                      <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.timeFrame.message}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Frequency*
                    </label>
                    <input
                      type="number"
                      {...step2Form.register("frequency", { valueAsNumber: true })}
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                        step2Form.formState.errors.frequency ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {step2Form.formState.errors.frequency && (
                      <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.frequency.message}</div>
                    )}
                  </div>
                </div>

                {/* Loop */}
                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    Loop*
                  </label>
                  <div className="flex space-x-6 mb-2">
                    {["Once", "Infinite", "Custom"].map((option) => {
                      const currentValue = step2Form.watch("loop");
                      return (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="loop"
                            value={option}
                            checked={currentValue === option}
                            className="w-4 h-4 text-green-500 border-green-500 focus:ring-green-500"
                            onChange={(e) => {
                              step2Form.setValue("loop", option);
                              if (option === "Custom") {
                                // Set a default value for amountOfTimes when Custom is selected
                                step2Form.setValue("amountOfTimes", 1);
                              } else {
                                // Clear amountOfTimes when other options are selected
                                step2Form.setValue("amountOfTimes", undefined);
                              }
                            }}
                          />
                          <span className="ml-2 text-sm text-black">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  {step2Form.formState.errors.loop && (
                    <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.loop.message}</div>
                  )}
                  <p className="text-blue-600 text-xs">Eg: Your bot will execute 1 time for 1 day</p>
                  
                  {/* Amount of Times - Only shown when Custom is selected */}
                  {step2Form.watch("loop") === "Custom" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-black mb-2">
                        Amount of times*
                      </label>
                      <input
                        type="number"
                        {...step2Form.register("amountOfTimes", { valueAsNumber: true })}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
                          step2Form.formState.errors.amountOfTimes ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {step2Form.formState.errors.amountOfTimes && (
                        <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountOfTimes.message}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : currentMainStep === 3 ? (
                  <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
                    {/* Left Arrow Button - Positioned on the left side of the card */}
                    {currentMainStep === 3 && (
                      <button 
                        className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                        onClick={() => setCurrentMainStep(2)}
                      >
                        <ArrowLeft className="w-6 h-6" />
                      </button>
                    )}
                    {/* Section Title */}
                   <div className="text-center mb-8">
                     <h3 className="text-2xl font-bold text-black mb-3">{isModifyMode ? "Modify bot settings" : "Review details"}</h3>
                     <div className="w-full h-0.5 bg-green-600 mx-auto"></div>
                   </div>

                   <div className="space-y-8">
                     {/* Bot Identification & Amount */}
                     <div className="border-b border-gray-200 pb-6">
                       <div className="grid grid-cols-3 gap-6">
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Bot Name</div>
                           {isModifyMode && editingField === 'botName' ? (
                             <input
                               type="text"
                               value={editValues.botName}
                               onChange={(e) => setEditValues({...editValues, botName: e.target.value})}
                               onBlur={() => setEditingField(null)}
                               className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                               autoFocus
                             />
                           ) : (
                             <div className="text-xl font-bold text-black flex items-center gap-2">
                               {isModifyMode ? editValues.botName : (step1Form.getValues("botName") || "MyDCA-1")}
                               {isModifyMode && (
                                 <button
                                   onClick={() => setEditingField('botName')}
                                   className="text-blue-600 hover:text-blue-800 text-sm"
                                 >
                                   ✏️
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Asset</div>
                           {isModifyMode && editingField === 'asset' ? (
                             <input
                               type="text"
                               value={editValues.asset}
                               onChange={(e) => setEditValues({...editValues, asset: e.target.value})}
                               onBlur={() => setEditingField(null)}
                               className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                               autoFocus
                             />
                           ) : (
                             <div className="text-xl font-bold text-black flex items-center gap-2">
                               {isModifyMode ? editValues.asset : (step2Form.getValues("assetName") || "BTCUSDT")} (Spot)
                               {isModifyMode && (
                                 <button
                                   onClick={() => setEditingField('asset')}
                                   className="text-blue-600 hover:text-blue-800 text-sm"
                                 >
                                   ✏️
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Amount ($)</div>
                           {isModifyMode && editingField === 'amount' ? (
                             <input
                               type="number"
                               value={editValues.amount}
                               onChange={(e) => setEditValues({...editValues, amount: parseFloat(e.target.value) || 0})}
                               onBlur={() => setEditingField(null)}
                               className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                               autoFocus
                             />
                           ) : (
                             <div className="text-xl font-bold text-black flex items-center gap-2">
                               {(isModifyMode ? editValues.amount : (step2Form.getValues("amountPerBuy") || 50)).toFixed(2)}
                               {isModifyMode && (
                                 <button
                                   onClick={() => setEditingField('amount')}
                                   className="text-blue-600 hover:text-blue-800 text-sm"
                                 >
                                   ✏️
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                       </div>
                     </div>

                     {/* Execution Parameters */}
                     <div className="border-b border-gray-200 pb-6">
                       <div className="grid grid-cols-3 gap-6">
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Time frame</div>
                           {isModifyMode && editingField === 'timeFrame' ? (
                             <select
                               value={editValues.timeFrame}
                               onChange={(e) => setEditValues({...editValues, timeFrame: e.target.value})}
                               onBlur={() => setEditingField(null)}
                               className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600 bg-white"
                               autoFocus
                             >
                               <option value="1Day">1 Day</option>
                               <option value="1Week">1 Week</option>
                               <option value="1Month">1 Month</option>
                               <option value="3Months">3 Months</option>
                               <option value="6Months">6 Months</option>
                               <option value="1Year">1 Year</option>
                             </select>
                           ) : (
                             <div className="text-xl font-bold text-black flex items-center gap-2">
                               {isModifyMode ? editValues.timeFrame : (step2Form.getValues("timeFrame") || "1Day")}
                               {isModifyMode && (
                                 <button
                                   onClick={() => setEditingField('timeFrame')}
                                   className="text-blue-600 hover:text-blue-800 text-sm"
                                 >
                                   ✏️
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Frequency</div>
                           {isModifyMode && editingField === 'frequency' ? (
                             <input
                               type="number"
                               value={editValues.frequency}
                               onChange={(e) => setEditValues({...editValues, frequency: parseInt(e.target.value) || 1})}
                               onBlur={() => setEditingField(null)}
                               className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                               autoFocus
                             />
                           ) : (
                             <div className="text-xl font-bold text-black flex items-center gap-2">
                               {(isModifyMode ? editValues.frequency : (step2Form.getValues("frequency") || 1))}x
                               {isModifyMode && (
                                 <button
                                   onClick={() => setEditingField('frequency')}
                                   className="text-blue-600 hover:text-blue-800 text-sm"
                                 >
                                   ✏️
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Loop</div>
                           {isModifyMode && editingField === 'loop' ? (
                             <div className="flex items-center gap-2">
                               <select
                                 value={editValues.loop}
                                 onChange={(e) => {
                                   setEditValues({...editValues, loop: e.target.value});
                                   // If changing to Custom, ensure amountOfTimes has a value
                                   if (e.target.value === 'Custom' && !editValues.amountOfTimes) {
                                     setEditValues(prev => ({...prev, amountOfTimes: 1}));
                                   }
                                 }}
                                 onBlur={() => setEditingField(null)}
                                 className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600 bg-white"
                                 autoFocus
                               >
                                 <option value="Once">Once</option>
                                 <option value="Infinite">Infinite</option>
                                 <option value="Custom">Custom</option>
                               </select>
                             </div>
                           ) : (
                             <div className="text-xl font-bold text-black flex items-center gap-2">
                               {isModifyMode ? editValues.loop : (step2Form.getValues("loop") || "Once")}
                               {(isModifyMode ? editValues.loop : step2Form.getValues("loop")) === "Custom" && (
                                 <span className="ml-2">
                                   {isModifyMode && editingField === 'amountOfTimes' ? (
                                     <input
                                       type="number"
                                       value={editValues.amountOfTimes}
                                       onChange={(e) => setEditValues({...editValues, amountOfTimes: parseInt(e.target.value) || 1})}
                                       onBlur={() => setEditingField(null)}
                                       className="w-16 text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                                       autoFocus
                                     />
                                   ) : (
                                     <span>
                                       ({isModifyMode ? editValues.amountOfTimes : (step2Form.getValues("amountOfTimes") || 1)} times)
                                       {isModifyMode && (
                                         <button
                                           onClick={() => setEditingField('amountOfTimes')}
                                           className="text-blue-600 hover:text-blue-800 text-sm ml-1"
                                         >
                                           ✏️
                                         </button>
                                       )}
                                     </span>
                                   )}
                                 </span>
                               )}
                               {isModifyMode && (
                                 <button
                                   onClick={() => setEditingField('loop')}
                                   className="text-blue-600 hover:text-blue-800 text-sm"
                                 >
                                   ✏️
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                       </div>
                     </div>

                     {/* Connection & Status */}
                     <div className="border-b border-gray-200 pb-6">
                       <div className="grid grid-cols-3 gap-6">
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Broker</div>
                           <div className="text-xl font-bold text-black">{isModifyMode ? editValues.broker : (step1Form.getValues("broker") || "ByBit")}</div>
                         </div>
                         <div>
                           <div className="text-sm text-gray-500 mb-2">API Status</div>
                           <div className="text-xl font-bold text-black">{currentSubStep === 3 ? "Connected" : "Not Connected"}</div>
                         </div>
                         <div>
                           <div className="text-sm text-gray-500 mb-2">Bot Type</div>
                           {isModifyMode && editingField === 'botType' ? (
                             <select
                               value={editValues.botType}
                               onChange={(e) => setEditValues({...editValues, botType: e.target.value})}
                               onBlur={() => setEditingField(null)}
                               className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600 bg-white"
                               autoFocus
                             >
                               <option value="Basic">Basic</option>
                               <option value="Smart">Smart</option>
                               <option value="Advance">Advance</option>
                             </select>
                           ) : (
                             <div className="text-xl font-bold text-black flex items-center gap-2">
                               {isModifyMode ? editValues.botType : (step1Form.getValues("botType") || "Basic")}
                               {isModifyMode && (
                                 <button
                                   onClick={() => setEditingField('botType')}
                                   className="text-blue-600 hover:text-blue-800 text-sm"
                                 >
                                   ✏️
                                 </button>
                               )}
                             </div>
                           )}
                         </div>
                       </div>
                     </div>

                     {/* Deployment Information */}
                     <div className="bg-gray-100 rounded-lg p-5">
                       <p className="text-sm text-gray-600 text-center leading-relaxed">
                         Your bot will execute on {isModifyMode ? editValues.broker : (step1Form.getValues("broker") || "ByBit")} with the above settings starting from July 12th 2025 at market order.
                       </p>
                     </div>

                     {/* Action Buttons */}
                     <div className="space-y-4">
                       <button
                         onClick={handleDeployBot}
                         className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-sm"
                       >
                         {isModifyMode ? "Update bot" : "Deploy bot"}
                       </button>
                       <button className="w-full bg-white border border-green-600 text-green-600 hover:bg-green-50 font-bold py-4 px-6 rounded-lg transition-colors">
                         Deploy signal
                       </button>
                     </div>
                   </div>
                 </div>
        ) : null}

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentMainStep >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${currentMainStep >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${currentMainStep >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        </div>

      </div>
    </div>
  );
}

export default BotSetup;