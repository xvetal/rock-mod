import { IWorldObject, IWorldObjectOptions } from "../worldObject";

export enum IBlipSprite {
  Higher,
  Lower,
  PolicePed,
  WantedRadius,
  Area,
  Centre,
  North,
  Waypoint,
  Radius,
  RadiusOutline,
  WeaponHigher,
  WeaponLower,
  HigherAI,
  LowerAI,
  PoliceHeliSpin,
  PolicePlaneMove,
  MPCrew = 27,
  MPFriendlies,
  CableCar = 36,
  Activities,
  Raceflag,
  Safehouse = 40,
  Police,
  PoliceChase,
  PoliceHeli,
  BombA,
  Snitch = 47,
  PlanningLocations,
  CriminalCarsteal = 50,
  CriminalDrugs,
  CriminalHoldups,
  CriminalPlayer = 54,
  CopPatrol = 56,
  CopPlayer,
  CriminalWanted,
  Heist,
  PoliceStation,
  Hospital,
  AssassinsMark,
  Elevator,
  Helicopter,
  RandomCharacter = 66,
  SecurityVan,
  TowTruck,
  IllegalParking = 70,
  Barber,
  CarModShop,
  ClothesStore,
  Tattoo = 75,
  ArmenianFamily,
  LesterFamily,
  MichaelFamily,
  TrevorFamily,
  JewelryHeist,
  DragRaceFinish = 82,
  Rampage = 84,
  VinewoodTours,
  LamarFamily,
  FranklinFamily = 88,
  ChineseStrand,
  FlightSchool,
  EyeSky,
  AirHockey,
  Bar,
  BaseJump,
  Basketball,
  BiolabHeist = 96,
  CabaretClub = 99,
  CarWash,
  ComedyClub = 102,
  Darts,
  DocksHeist,
  FbiHeist,
  FbiOfficersStrand,
  FinaleBankHeist,
  FinancierStrand,
  Golf,
  GunShop,
  InternetCafe,
  MichaelFamilyExile,
  NiceHouseHeist,
  RandomFemale,
  RandomMale,
  RuralBankHeist = 118,
  ShootingRange,
  SolomonStrand,
  StripClub,
  Tennis,
  TrevorFamilyExile,
  MichaelTrevorFamily,
  Triathlon = 126,
  OffRoadRacing,
  GangCops,
  GangMexicans,
  GangBikers,
  SnitchRed = 133,
  CriminalCuffKeys,
  Cinema,
  MusicVenue,
  PoliceStationBlue,
  Airport,
  CriminalSavedVehicle,
  WeedStash,
  Hunting,
  Pool,
  ObjectiveBlue,
  ObjectiveGreen,
  ObjectiveRed,
  ObjectiveYellow,
  ArmsDealing,
  MPFriend,
  CelebrityTheft,
  WeaponAssaultRifle,
  WeaponBat,
  WeaponGrenade,
  WeaponHealth,
  WeaponKnife,
  WeaponMolotov,
  WeaponPistol,
  WeaponRocket,
  WeaponShotgun,
  WeaponSmg,
  WeaponSniper,
  MPNoise,
  PointOfInterest,
  Passive,
  UsingMenu,
  GangCopsPartner = 171,
  WeaponMinigun = 173,
  WeaponArmour = 175,
  PropertyTakeover,
  GangMexicansHighlight,
  GangBikersHighlight,
  TriathlonCycling,
  TriathlonSwimming,
  PropertyTakeoverBikers,
  PropertyTakeoverCops,
  PropertyTakeoverVagos,
  Camera,
  CentreRed,
  HandcuffKeysBikers,
  HandcuffKeysVagos,
  HandcuffsClosedBikers,
  HandcuffsClosedVagos,
  CameraBadger = 192,
  CameraFacade,
  CameraIfruit,
  Yoga = 197,
  Taxi,
  Shrink = 205,
  Epsilon,
  FinancierStrandGrey,
  TrevorFamilyGrey,
  TrevorFamilyRed,
  FranklinFamilyGrey,
  FranklinFamilyBlue,
  FranklinA,
  FranklinB,
  FranklinC,
  GangVehicle = 225,
  GangVehicleBikers,
  GangVehicleCops,
  GangVehicleVagos,
  Guncar,
  DrivingBikers,
  DrivingCops,
  DrivingVagos,
  GangCopsHighlight,
  ShieldBikers,
  ShieldCops = 235,
  ShieldVagos,
  CustodyBikers,
  CustodyVagos,
  ArmsDealingAir = 251,
  PlayerStateArrested,
  PlayerStateCustody,
  PlayerStateDriving,
  PlayerStateKeyholder,
  PlayerStatePartner,
  Ztype = 262,
  Stinger,
  Packer,
  Monroe,
  Fairground,
  Property,
  GangHighlight,
  Altruist,
  AI,
  OnMission,
  CashPickup,
  Chop,
  Dead,
  TerritoryLocked,
  CashLost,
  CashVagos,
  CashCops,
  Hooker,
  Friend,
  Mission2to4,
  Mission2to8,
  Mission2to12,
  Mission2to16,
  CustodyDropOff,
  OnMissionCops,
  OnMissionLost,
  OnMissionVagos,
  CriminalCarStealCops,
  CriminalCarStealBikers,
  CriminalCarStealVagos,
  BandStrand,
  SimeonFamily,
  Mission1,
  Mission2,
  FriendDarts,
  FriendComedyClub,
  FriendCinema,
  FriendTennis,
  FriendStripClub,
  FriendLiveMusic,
  FriendGolf,
  BountyHit,
  UgcMission,
  Horde,
  CrateDrop,
  PlaneDrop,
  Sub,
  Race,
  Deathmatch,
  ArmWrestling,
  Mission1to2,
  ShootingRangeGunShop,
  RaceAir,
  RaceLand,
  RaceSea,
  Tow,
  Garbage,
  Drill,
  Spikes,
  Firetruck,
  Minigun2,
  Bugstar,
  Submarine,
  Chinook,
  GetawayCar,
  MissionBikers1,
  MissionBikers1to2,
  MissionBikers2,
  MissionBikers2to4,
  MissionBikers2to8,
  MissionBikers2to12,
  MissionBikers2to16,
  MissionCops1,
  MissionCops1to2,
  MissionCops2,
  MissionCops2to4,
  MissionCops2to8,
  MissionCops2to12,
  MissionCops2to16,
  MissionVagos1,
  MissionVagos1to2,
  MissionVagos2,
  MissionVagos2to4,
  MissionVagos2to8,
  MissionVagos2to12,
  MissionVagos2to16,
  GangBike,
  GasGrenade,
  PropertyForSale,
  GangAttackPackage,
  MartinMadrazzo,
  EnemyHeliSpin,
  Boost,
  Devin,
  Dock,
  Garage,
  GolfFlag,
  Hangar,
  Helipad,
  JerryCan,
  Mask,
  HeistPrep,
  Incapacitated,
  SpawnPointPickup,
  Boilersuit,
  Completed,
  Rockets,
  GarageForSale,
  HelipadForSale,
  DockForSale,
  HangarForSale,
  Placeholder6,
  Business,
  BusinessForSale,
  RaceBike,
  Parachute,
  TeamDeathmatch,
  RaceFoot,
  VehicleDeathmatch,
  Barry,
  Dom,
  Maryann,
  Cletus,
  Josh,
  Minute,
  Omega,
  Tonya,
  Paparazzo,
  Aim,
  CrateDropBackground,
  GreenAndNetPlayer1,
  GreenAndNetPlayer2,
  GreenAndNetPlayer3,
  GreenAndFriendly,
  NetPlayer1AndNetPlayer2,
  NetPlayer1AndNetPlayer3,
  Creator,
  CreatorDirection,
  Abigail,
  Blimp,
  Repair,
  Testosterone,
  Dinghy,
  Fanatic,
  InfoIcon = 407,
  CaptureTheFlag,
  LastTeamStanding,
  Boat,
  CaptureTheFlagBase,
  CaptureTheFlagOutline = 413,
  CaptureTheFlagBaseNoBag,
  WeaponJerrycan,
  Rp,
  LevelInside,
  BountyHitInside,
  CaptureTheUSAFlag,
  CaptureTheUSAFlagOutline,
  Tank,
  PlayerHeli,
  PlayerPlane,
  PlayerJet,
  CentreStroke,
  PlayerGunCar,
  PlayerBoat,
  MPHeist,
  Temp1,
  Temp2,
  Temp3,
  Temp4,
  Temp5,
  Temp6,
  RaceStunt,
  HotProperty,
  UrbanWarfareVersus,
  KingOfTheCastle,
  PlayerKing,
  DeadDrop,
  PennedIn,
  Beast,
  EdgePointer,
  EdgeCrossTheLine,
  MPLamar,
  Bennys,
  CornerNumber1,
  CornerNumber2,
  CornerNumber3,
  CornerNumber4,
  CornerNumber5,
  CornerNumber6,
  CornerNumber7,
  CornerNumber8,
  Yacht,
  FindersKeepers,
  AssaultPackage,
  HuntTheBoss,
  Sightseer,
  TurretedLimo,
  BellyOfTheBeast,
  YachtLocation,
  PickupBeast,
  PickupZoned,
  PickupRandom,
  PickupSlowTime,
  PickupSwap,
  PickupThermal,
  PickupWeed,
  WeaponRailgun,
  Seashark,
  PickupHidden,
  Warehouse,
  WarehouseForSale,
  Office,
  OfficeForSale,
  Truck,
  Contraband,
  Trailer,
  VIP,
  Cargobob,
  AreaOutline,
  PickupAccelerator,
  PickupGhost,
  PickupDetonator,
  PickupBomb,
  PickupArmoured,
  Stunt,
  WeaponLives,
  StuntPremium,
  Adversary,
  BikerClubhouse,
  BikerCagedIn,
  BikerTurfWar,
  BikerJoust,
  ProductionWeed,
  ProductionCrack,
  ProductionFakeId,
  ProductionMeth,
  ProductionMoney,
  Package,
  Capture1,
  Capture2,
  Capture3,
  Capture4,
  Capture5,
  Capture6,
  Capture7,
  Capture8,
  Capture9,
  Capture10,
  Quad,
  Bus,
  DrugsPackage,
  PickupJump,
  Adversary4,
  Adversary8,
  Adversary10,
  Adversary12,
  Adversary16,
  Laptop,
  PickupDeadline,
  SportsCar,
  WarehouseVehicle,
  RegPapers,
  PoliceStationDropoff,
  Junkyard,
  ExVech1,
  ExVech2,
  ExVech3,
  ExVech4,
  ExVech5,
  ExVech6,
  ExVech7,
  TargetA,
  TargetB,
  TargetC,
  TargetD,
  TargetE,
  TargetF,
  TargetG,
  TargetH,
  Juggernaut,
  PickupRepair,
  SteeringWheel,
  Trophy,
  PickupRocketBoost,
  PickupHomingRocket,
  PickupMachinegun,
  PickupParachute,
  PickupTime5,
  PickupTime10,
  PickupTime15,
  PickupTime20,
  PickupTime30,
  Supplies,
  PropertyBunker,
  GrWvm1,
  GrWvm2,
  GrWvm3,
  GrWvm4,
  GrWvm5,
  GrWvm6,
  GrCovertOps,
  AdversaryBunker,
  GrMocUpgrade,
  GrWUpgrade,
  SmCargo,
  SmHangar,
  TfCheckpoint,
  RaceTf,
  SmWp1,
  SmWp2,
  SmWp3,
  SmWp4,
  SmWp5,
  SmWp6,
  SmWp7,
  SmWp8,
  SmWp9,
  SmWp10,
  SmWp11,
  SmWp12,
  SmWp13,
  SmWp14,
  NhpBag,
  NhpChest,
  NhpOrbit,
  NhpVeh1,
  NhpBase,
  NhpOverlay,
  NhpTurret,
  NhpMgFirewall,
  NhpMgNode,
  NhpWp1,
  NhpWp2,
  NhpWp3,
  NhpWp4,
  NhpWp5,
  NhpWp6,
  NhpWp7,
  NhpWp8,
  NhpWp9,
  NhpCCTV,
  NhpStarterpack,
  NhpTurretConsole,
  NhpMgMirRotate,
  NhpMgMirStatic,
  NhpMgProxy,
  AcsrRaceTarget,
  AcsrRaceHotring,
  AcsrWp1,
  AcsrWp2,
  BatClubProperty,
  BatCargo,
  BatTruck,
  BatHackJewel,
  BatHackGold,
  BatKeypad,
  BatHackTarget,
  PickupDtbHealth,
  PickupDtbBlastIncrease,
  PickupDtbBlastDecrease,
  PickupDtbBombIncrease,
  PickupDtbBombDecrease,
  BatRivalClub,
  BatDrone,
  BatCashReg,
  CCTV,
  BatAssassinate,
  BatPbus,
  BatWp1,
  BatWp2,
  BatWp3,
  BatWp4,
  BatWp5,
  BatWp6,
  Blimp2,
  Oppressor2,
  BatWp7,
  ArenaSeries,
  ArenaPremium,
  ArenaWorkshop,
  RaceWars,
  ArenaTurret,
  ArenaRCCar,
  ArenaRCWorkshop,
  ArenaTrapFire,
  ArenaTrapFlip,
  ArenaTrapSea,
  ArenaTrapTurn,
  ArenaTrapPit,
  ArenaTrapMine,
  ArenaTrapBomb,
  ArenaTrapWall,
  ArenaTrapBrd,
  ArenaTrapSbrd,
  ArenaBruiser,
  ArenaBrutus,
  ArenaCerberus,
  ArenaDeathbike,
  ArenaDominator,
  ArenaImpaler,
  ArenaImperator,
  ArenaIssi,
  ArenaSasquatch,
  ArenaScarab,
  ArenaSlamvan,
  ArenaZr,
  AP,
  ComicStore,
  CopCar,
  RCTimeTrials,
  KingOfTheHill,
  KingOfTheHillTeams,
  Rucksack,
  ShippingContainer,
  Agatha,
  Casino,
  CasinoTableGames,
  CasinoWheel,
  CasinoConcierge,
  CasinoChips,
  CasinoHorseRacing,
  AdversaryFeatured,
  Roulette1,
  Roulette2,
  Roulette3,
  Roulette4,
  Roulette5,
  Roulette6,
  Roulette7,
  Roulette8,
  Roulette9,
  Roulette10,
  Roulette11,
  Roulette12,
  Roulette13,
  Roulette14,
  Roulette15,
  Roulette16,
  Roulette17,
  Roulette18,
  Roulette19,
  Roulette20,
  Roulette21,
  Roulette22,
  Roulette23,
  Roulette24,
  Roulette25,
  Roulette26,
  Roulette27,
  Roulette28,
  Roulette29,
  Roulette30,
  Roulette31,
  Roulette32,
  Roulette33,
  Roulette34,
  Roulette35,
  Roulette36,
  Roulette0,
  Roulette00,
  Limo,
  WeaponAlien,
  RaceOpenWheel,
  Rappel,
  SwapCar,
  ScubaGear,
  Cpanel1,
  Cpanel2,
  Cpanel3,
  Cpanel4,
  SnowTruck,
  Buggy1,
  Buggy2,
  Zhaba,
  Gerald,
  Ron,
  Arcade,
  DroneControls,
  RCTank,
  Stairs,
  Camera2,
  Winky,
  MiniSub,
  KartRetro,
  KartModern,
  MilitaryQuad,
  MilitaryTruck,
  ShipWheel,
  UFO,
  Seasparrow2,
  Dinghy2,
  PatrolBoat,
  RetroSportsCar,
  Squadee,
  FoldingWingJet,
  Valkyrie2,
  Sub2,
  BoltCutters,
  RappelGear,
  KeyCard,
  Password,
  IslandHeistPrep,
  IslandParty,
  ControlTower,
  UnderwaterGate,
  PowerSwitch,
  CompoundGate,
  RappelPoint,
  KeyPad,
  SubControls,
  SubPeriscope,
  SubMissile,
  Painting,
  CarMeet,
  CarTestArea,
  AutoShopProperty,
  DocksExport,
  PrizeCar,
  TestCar,
  CarRobberyBoard,
  CarRobberyPrep,
  StreetRaceSeries,
  PursuitSeries,
  CarMeetOrganiser,
  SecuroServ,
  BountyCollectibles,
  MovieCollectibles,
  TrailerRamp,
  RaceOrganiser,
  ChalkboardList,
  ExportVehicle,
  Train,
  HeistDiamond,
  HeistDoomsday,
  HeistIsland,
  Slamvan2,
  Crusader,
  ConstructionOutfit,
  OverlayJammed,
  HeistIslandUnavailable,
  HeistDiamondUnavailable,
  HeistDoomsdayUnavailable,
  Placeholder7,
  Placeholder8,
  Placeholder9,
  FeaturedSeries,
  VehicleForSale,
  VanKeys,
  SuvService,
  SecurityContract,
  Safe,
  PedR,
  PedE,
  Payphone,
  Patriot3,
  MusicStudio,
  Jubilee,
  Granger2,
  ExplosiveCharge,
  Deity,
  DChampion,
  Buffalo4,
  Agency,
}

export enum IBlipColor {
  White,
  Red,
  Green,
  Blue,
  Yellow = 5,
  LightRed,
  Violet,
  Pink,
  LightOrange,
  LightBrown,
  LightGreen,
  LightBlue,
  LightPurple,
  DarkPurple,
  Cyan,
  LightYellow,
  Organe,
  DarkPink = 19,
  GraniteGreen,
  DarkBrown,
  LightGray,
  LightPink,
  LemonGreen,
  ForestGreen,
  ElectricBlue,
  BrightPurple,
  DarkYellow,
  DarkCyan = 30,
  Beige = 36,
  DarkGray = 40,
  PinkRed,
  Gold = 46,
  Orange,
  BrilliantRose,
  MediumPurple = 50,
  Salmon,
  DarkGreen,
  BlizzardBlue,
  OracleBlue,
  Silver,
  EastBay = 58,
  YellowOrange = 60,
  MulberryPink,
  AltoGray,
  JellyBeanBlue,
  DarkOrange,
  Mamba,
  TransparentBlack = 72,
  DeepRed = 76,
  TransparentRed = 79,
  TransparentBlue = 80,
  Purple = 83,
}

export interface IBlipOptions extends IWorldObjectOptions {}

export interface IBlip extends IWorldObject {
  get name(): string;
  get sprite(): IBlipSprite;
  get color(): number;
  get alpha(): number;
  get scale(): number;
  get drawDistance(): number;
  get shortRange(): boolean;
  get rotation(): number;
  get dimension(): number;
  setName(value: string): void;
  setSprite(value: IBlipSprite): void;
  setColor(value: IBlipColor): void;
  setAlpha(value: number): void;
}
