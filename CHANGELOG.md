## 0.7.0
- breaking change to block renderer API, depth is now passed along keys and data as second param
- added proper surrogate pair handling for multibyte unicode characters #15
- added split to cleanup options - it allows to separate groups with blocks that qualify for cleanup, see [example](http://lokiuz.github.io/redraft/)
- added key for inline and entity renderers

## 0.6.0
- modified block renderers api: keys are now wrapped in an object along with new data key containing block metadata
- added joinOutput and cleanup options to the API
- removed deprecated API

## 0.5.0
- added block keys array as third parameter to block renderers #11
- all deprecated methods and warnings will be removed in the next minor version

## 0.4.2
- fixes final ContentNode being unstyled when there are mutliple entities in a block #9
- some minor code styling

## 0.4.1
- fixes result is null, when first line is empty #4
- added some extra validation and a warning in non production env if the raw is invalid
- passing a raw with an empty blocks array returns a null

## 0.4.0
- added support for blocks with depth
- block renderer now receives a second argument - depth

## 0.3.0
- redraft now has a default export
- directly importing renderRaw is now deprecated
- renderers should now be provided in a single object as a second argument
- added warnings for all deprecated calls in non production
- updated readme to reflect the changes

## 0.2.4
- fixes blocks with content length=1 do not display #1

## 0.2.3
- some cleanup and dropped lodash as a dependency

## 0.2.2
- rewrite of the nodeIterator and pushContent methods

## 0.2.1
- few less iterations of RawParser
- strings are concatenated inside ContentNode

## 0.2.0
- Added basic entity parsing and the ContentNode class
- Minor fixes
