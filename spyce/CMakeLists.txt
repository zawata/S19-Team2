cmake_minimum_required(VERSION 3.12.4)

set(CMAKE_VERBOSE_MAKEFILE on)

project(Spyce)

#
# Set up Variables
#

if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    set(ARCH "64")
else()
    set(ARCH "32")
endif()

#The order here is important. apple is considered to be both "apple" and "unix"
if(APPLE)
    set(PLATFORM "apple")
elseif(UNIX)
    set(PLATFORM "linux")
elseif(WIN32)
    set(PLATFORM "win32")
endif()

#
# Actual Project Declarations
#
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")

include_directories(
        cspice/include
        inc)

link_directories(
        cspice/lib)

add_library( spyce SHARED
        py_wrapper.cpp
        spyce_main.cpp)

#Move library back to source folder for easy access
set_target_properties( spyce PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY "../../spyce")

#Remove the "lib-" prefix because the naming scheme
set_target_properties( spyce PROPERTIES
        PREFIX "")

if(APPLE)
    #Apparently python doesn't load ".dylib" files. 
    #We have to change the extension to force it
    set_target_properties(spyce PROPERTIES 
            SUFFIX ".so")
endif()

target_link_libraries( spyce
        cspice_${PLATFORM}_${ARCH}.a)

find_package(Python3 REQUIRED COMPONENTS Development)
IF (Python3_FOUND)
    include_directories(${Python3_INCLUDE_DIR})
    target_link_libraries( spyce
            ${Python3_LIBRARIES})
endif()

find_package(Boost REQUIRED COMPONENTS
        filesystem python${Python3_VERSION_MAJOR}${Python3_VERSION_MINOR})
IF (Boost_FOUND)
    include_directories(${Boost_INCLUDE_DIR})
    target_link_libraries( spyce
            ${Boost_LIBRARIES})
endif()